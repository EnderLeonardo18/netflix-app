import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexusService } from '../../core/services/nexus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-predictive-cache',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './predictive-cache.component.html',
  styleUrl: './predictive-cache.component.css'
})
export class PredictiveCacheComponent implements OnInit, OnDestroy {
  downloadProgress: { [key: number]: number } = {};
  downloadedMovieIds: number[] = [];

  // Simulamos nombres mapeados para la visualización del panel técnico
  movieTitles: { [key: number]: string } = {
    1: 'Stranger Things (Temporada 4)',
    2: 'Wednesday (Episodio 1)',
    3: 'Guillermo del Toro\'s Pinocchio'
  };

  private subs: Subscription[] = [];

  constructor(private nexusService: NexusService) {}

  ngOnInit(): void {
    const progressSub = this.nexusService.downloadProgress$.subscribe(p => this.downloadProgress = p);
    const downloadedSub = this.nexusService.downloadedMovies$.subscribe(d => this.downloadedMovieIds = d);
    this.subs.push(progressSub, downloadedSub);
  }

  forceDownload(id: number): void {
    this.nexusService.startPredictiveDownload(id);
  }

  getProgressKeys() {
    return Object.keys(this.downloadProgress).map(Number);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
