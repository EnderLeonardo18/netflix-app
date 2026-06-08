import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommunityNode, NexusService } from '../../core/services/nexus.service';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = false;
  nodeData!: CommunityNode;
  private sub!: Subscription;

  constructor(private nexusService: NexusService){}

  ngOnInit(): void {
    // Nos suscribimos al estado global para actualizar el dinero del Navbar inmediatamente al pagar
    this.sub = this.nexusService.nodeState$.subscribe(state => {
      this.nodeData = state;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(){
    this.isScrolled = window.scrollY > 50;
  }

  ngOnDestroy(): void{
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

}
