import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NexusService, CommunityNode, PaymentTransaction } from '../../core/services/nexus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css'
})
export class FinancesComponent implements OnInit, OnDestroy {
  nodeData!: CommunityNode;
  transactions: PaymentTransaction[] = [];
  activeTab: 'PAGO_MOVIL' | 'BINANCE_PAY' = 'PAGO_MOVIL';

  pmBanco = 'Banco de Venezuela';
  pmTelefono = '';
  pmCedula = '';
  pmMonto = 400;

  binanceId = '';
  binanceMonto = 10;

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

  submitPagoMovil(): void {
    if (!this.pmTelefono || !this.pmCedula || this.pmMonto <= 0) return;
    this.isProcessing = true;
    this.nexusService.processPagoMovil(this.pmBanco, this.pmTelefono, this.pmCedula, this.pmMonto)
      .subscribe(() => {
        this.isProcessing = false;
        this.successMessage = `¡Pago Móvil Procesado! Referencia añadida en tiempo real al nodo.`;
        this.pmTelefono = ''; this.pmCedula = '';
      });
  }

  submitBinancePay(): void {
    if (!this.binanceId || this.binanceMonto <= 0) return;
    this.isProcessing = true;
    this.nexusService.processBinancePay(this.binanceId, this.binanceMonto)
      .subscribe(() => {
        this.isProcessing = false;
        this.successMessage = `¡Firma de Binance Pay validada exitosamente en el pool distributivo!`;
        this.binanceId = '';
      });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}
