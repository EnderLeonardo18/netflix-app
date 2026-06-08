import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../core/models/movie.model';
import { NexusService } from '../../core/services/nexus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredMovie!: Movie;
  trendingMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  comedyMovies: Movie[] = []; // <- CORRECCIÓN: Declarada para evitar el error 2339

  // Estado local mapeado desde el servicio NEXUS
  downloadedMovieIds: number[] = [];
  downloadProgress: { [key: number]: number } = {};
  currentRegion = 'VE';

  private subs: Subscription[] = [];

  constructor(private nexusService: NexusService) {}

  ngOnInit(): void {
    const mockData = this.getMockMovies();
    this.featuredMovie = mockData[0];

    // Escuchar cambios de región del Proxy para reordenar o cambiar el catálogo
    const proxySub = this.nexusService.nodeState$.subscribe(state => {
      this.currentRegion = state.activeProxyRegion;
      this.updateCatalogByRegion(mockData);
    });

    // Escuchar el progreso de descargas predictivas
    const dlMoviesSub = this.nexusService.downloadedMovies$.subscribe(ids => {
      this.downloadedMovieIds = ids;
    });

    const progressSub = this.nexusService.downloadProgress$.subscribe(progress => {
      this.downloadProgress = progress;
    });

    this.subs.push(proxySub, dlMoviesSub, progressSub);
  }

  // Distribución del catálogo respetando tus 3 filas originales de Netflix
  private updateCatalogByRegion(mockData: Movie[]): void {
    if (this.currentRegion === 'VE') {
      this.trendingMovies = [...mockData];
      this.actionMovies = [...mockData].reverse();
      this.comedyMovies = [mockData[1], mockData[2], mockData[0]];
    } else {
      // Variación sutil si cambia de región el proxy comunitario
      this.trendingMovies = [...mockData].reverse();
      this.actionMovies = [mockData[1], mockData[0], mockData[2]];
      this.comedyMovies = [...mockData];
    }
  }

  // Métodos de verificación y acción para la caché offline del nodo
  isMovieDownloaded(movieId: number): boolean {
    return this.downloadedMovieIds.includes(movieId);
  }

  triggerDownload(movieId: number): void {
    this.nexusService.startPredictiveDownload(movieId);
  }

  truncateOverview(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private getMockMovies(): Movie[] {
    return [
      {
        id: 1,
        title: 'Stranger Things',
        backdropPath: 'https://image.tmdb.org/t/p/original/56v2KjWu7Z6bYmZ5wzoorwQ42zC.jpg',
        posterPath: 'https://image.tmdb.org/t/p/w500/uHQgZRy86UnmZ67uG369v6G6QvX.jpg',
        overview: 'Cuando un niño desaparece, sus amigos y la policía se ven envueltos en experimentos secretos gubernamentales en un contexto hostil.',
        voteAverage: 8.8
      },
      {
        id: 2,
        title: 'Wednesday',
        backdropPath: 'https://image.tmdb.org/t/p/original/iH90G9zZii690wA0fSgNAV67wZu.jpg',
        posterPath: 'https://image.tmdb.org/t/p/w500/9PFHA5w2G48YPhjA9z6z26A266b.jpg',
        overview: 'Merlina Addams investiga una ola de asesinatos mientras hace nuevos amigos y enemigos en la Academia Nunca Más.',
        voteAverage: 8.5
      },
      {
        id: 3,
        title: 'Cobra Kai',
        backdropPath: 'https://image.tmdb.org/t/p/original/32vLndXI97m6g2vsc4g9m093YvA.jpg',
        posterPath: 'https://image.tmdb.org/t/p/w500/z0O36vYwkn6Yv6HGg8gS866uiTe.jpg',
        overview: 'Décadas después del torneo que les cambió la vida, la rivalidad entre Johnny y Daniel se reaviva en esta secuela de Karatékid.',
        voteAverage: 8.4
      }
    ];
  }
}
