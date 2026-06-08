import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexusService, CommunityNode } from '../../core/services/nexus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-sharing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-sharing.component.html',
  styleUrl: './data-sharing.component.css'
})
export class DataSharingComponent implements OnInit, OnDestroy {
  nodeData!: CommunityNode;
  private sub!: Subscription;

  constructor(private nexusService: NexusService) {}

  ngOnInit(): void {
    this.sub = this.nexusService.nodeState$.subscribe(data => this.nodeData = data);
  }

  onToggleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nexusService.toggleDataSharing(input.checked);
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
