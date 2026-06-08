import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NexusService, CommunityNode, PaymentTransaction } from '../../core/services/nexus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nexus-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nexus-dashboard.component.html',
  styleUrl: './nexus-dashboard.component.css'
})
export class NexusDashboardComponent implements OnInit, OnDestroy {
  nodeData!: CommunityNode;
  transactions: PaymentTransaction[] = [];
  activeTab: 'PAGO_MOVIL' | 'BINANCE_PAY' = 'PAGO_MOVIL';

  // Modelos de los formularios (Tipados estrictamente)
  pmBanco = 'Banco de Venezuela';
  pmTelefono = '';
  pmCedula = '';
  pmMonto = 400; // Monto por defecto en Bs.

  binanceId = '';
  binanceMonto = 10; // Monto por defecto en USDT

  isProcessing = false;
  successMessage = '';

  private subs: Subscription[] = [];

  constructor(private nexusService: NexusService) {}

  ngOnInit(): void {
    const nodeSub = this.nexusService.nodeState$.subscribe(data => this.nodeData = data);
    const txSub = this.nexusService.transactions$.subscribe(txs => this.transactions = txs);
    this.subs.push(nodeSub, txSub);
  }

  setTab(tab: 'PAGO_MOVIL' | 'BINANCE_PAY'): void {
    this.activeTab = tab;
    this.successMessage = '';
  }

  onProxyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.nexusService.changeProxyRegion(select.value);
  }

  onDataSharingChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.nexusService.toggleDataSharing(input.checked);
  }

  submitPagoMovil(): void {
    if (!this.pmTelefono || !this.pmCedula || this.pmMonto <= 0) return;
    this.isProcessing = true;

    this.nexusService.processPagoMovil(this.pmBanco, this.pmTelefono, this.pmCedula, this.pmMonto)
      .subscribe(() => {
        this.isProcessing = false;
        this.successMessage = `¡Pago Móvil Procesado! Referencia añadida al histórico del nodo.`;
        this.pmTelefono = '';
        this.pmCedula = '';
      });
  }

  submitBinancePay(): void {
    if (!this.binanceId || this.binanceMonto <= 0) return;
    this.isProcessing = true;

    this.nexusService.processBinancePay(this.binanceId, this.binanceMonto)
      .subscribe(() => {
        this.isProcessing = false;
        this.successMessage = `¡Transferencia Binance Pay aprobada instantáneamente vía Nodo Proxy!`;
        this.binanceId = '';
      });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
