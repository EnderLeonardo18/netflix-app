import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../core/models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Propiedades del Banner
  featuredMovie!: Movie;

  // Propiedades de las Filas de Películas
  trendingMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  comedyMovies: Movie[] = [];

  ngOnInit(): void {
    const mockData = this.getMockMovies();

    // Asignamos la película destacada del Banner
    this.featuredMovie = mockData[0];

    // Distribuimos los bloques de películas para las filas
    this.trendingMovies = [...mockData];
    this.actionMovies = [...mockData].reverse();
    this.comedyMovies = [mockData[1], mockData[2], mockData[0]];
  }

  // Función para recortar el texto largo del Banner
  truncateOverview(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Datos simulados (Mock Data) con imágenes reales de TMDB
  private getMockMovies(): Movie[] {
    return [
      {
        id: 1,
        title: 'Stranger Things',
        backdropPath: 'https://image.tmdb.org/t/p/original/56v2KjWu7Z6bYmZ5wzoorwQ42zC.jpg',
        posterPath: 'https://image.tmdb.org/t/p/w500/uHQgZRy86UnmZ67uG369v6G6QvX.jpg',
        overview: 'Cuando un niño desaparece, sus amigos, la familia y la policía se ven envueltos en una serie de eventos misteriosos al tratar de encontrarlo, incluyendo experimentos secretos del gobierno y fuerzas sobrenaturales.',
        voteAverage: 8.8
      },
      {
        id: 2,
        title: 'Wednesday',
        backdropPath: 'https://image.tmdb.org/t/p/original/iH90G9zZii690wA0fSgNAV67wZu.jpg',
        posterPath: 'https://image.tmdb.org/t/p/w500/9PFHA5w2G48YPhjA9z6z26A266b.jpg',
        overview: 'Brillante, antisocial y un poco muerta por dentro, Merlina Addams investiga una ola de asesinatos mientras hace nuevos amigos —y enemigos— en la Academia Nunca Más.',
        voteAverage: 8.5
      },
      {
        id: 3,
        title: 'The Witcher',
        backdropPath: 'https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfY0w9vOm6nwur.jpg',
        posterPath: 'https://image.tmdb.org/t/p/w500/7v6w66wQz0wU8jEaWqG7w8vG6w5.jpg',
        overview: 'Geralt de Rivia, un cazador de monstruos mutante, viaja en pos de su destino por un mundo turbulento en el que, a menudo, los humanos son peores que las bestias.',
        voteAverage: 8.2
      }
    ];
  }
}
