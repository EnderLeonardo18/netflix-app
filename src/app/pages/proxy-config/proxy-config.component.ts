import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexusService, CommunityNode } from '../../core/services/nexus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-proxy-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proxy-config.component.html',
  styleUrl: './proxy-config.component.css'
})
export class ProxyConfigComponent implements OnInit, OnDestroy {
  nodeData!: CommunityNode;
  private sub!: Subscription;

  constructor(private nexusService: NexusService) {}

  ngOnInit(): void {
    this.sub = this.nexusService.nodeState$.subscribe(data => this.nodeData = data);
  }

  onProxyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.nexusService.changeProxyRegion(select.value);
  }

  selectRegion(region: string): void {
    this.nexusService.changeProxyRegion(region);
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
