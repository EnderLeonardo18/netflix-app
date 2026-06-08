import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// INTERFACES ESTRICTAS (Garantizan robustez y cero uso de tipo 'any')
export interface CommunityNode {
  nodeName: string;
  totalMembers: number;
  monthlyQuotaUSD: number;
  currentFundsUSD: number;
  activeProxyRegion: string; // 'VE' | 'AR' | 'ES'
  dataSharingActive: boolean;
  unlockedTitlesCount: number;
}

export interface PaymentTransaction {
  id: string;
  method: 'PAGO_MOVIL' | 'BINANCE_PAY';
  user: string;
  amountVES?: number;
  amountUSDT?: number;
  reference: string;
  status: 'PENDING' | 'SUCCESS';
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NexusService {
// Estado inicial simulado del Nodo Comunitario en Venezuela
  private initialNodeState: CommunityNode = {
    nodeName: 'Nodo 04 - Altos de Miranda',
    totalMembers: 12,
    monthlyQuotaUSD: 25.00,
    currentFundsUSD: 14.50, // Lo acumulado hasta ahora por los vecinos
    activeProxyRegion: 'VE', // Región por defecto
    dataSharingActive: false,
    unlockedTitlesCount: 42
  };

  // BehaviorSubjects para emitir los estados reactivos a los componentes
  private nodeSubject = new BehaviorSubject<CommunityNode>(this.initialNodeState);
  private transactionsSubject = new BehaviorSubject<PaymentTransaction[]>([]);
  private downloadedMoviesSubject = new BehaviorSubject<number[]>([]); // Almacena IDs de películas en caché
  private downloadProgressSubject = new BehaviorSubject<{ [key: number]: number }>({}); // [movieId]: porcentaje

  // Exponer los Observables públicos para que los componentes se suscriban
  nodeState$: Observable<CommunityNode> = this.nodeSubject.asObservable();
  transactions$: Observable<PaymentTransaction[] | any> = this.transactionsSubject.asObservable();
  downloadedMovies$: Observable<number[]> = this.downloadedMoviesSubject.asObservable();
  downloadProgress$: Observable<{ [key: number]: number }> = this.downloadProgressSubject.asObservable();

  constructor() {
    // Agregamos algunas transacciones previas ficticias para dar realismo a la UI
    this.transactionsSubject.next([
      { id: '1', method: 'BINANCE_PAY', user: 'Vecino @ender_dev', amountUSDT: 5.00, reference: '984321', status: 'SUCCESS', date: new Date() },
      { id: '2', method: 'PAGO_MOVIL', user: 'Vecina @maria_m', amountVES: 360.00, reference: '0439', status: 'SUCCESS', date: new Date() }
    ]);
  }

  // ================= PUNTO 1: CAMBIO DE REGIÓN DEL PROXY =================
  changeProxyRegion(regionCode: string): void {
    const current = this.nodeSubject.value;
    this.nodeSubject.next({
      ...current,
      activeProxyRegion: regionCode
    });
  }

  // ================= PUNTO 2: PROCESAMIENTO DE PAGOS SIMULADOS =================
  processPagoMovil(banco: string, telefono: string, cedula: string, montoBs: number): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      // Simula el retraso de red de la pasarela bancaria / Biopago (1.5 segundos)
      setTimeout(() => {
        const currentTransactions = this.transactionsSubject.value;
        const currentNode = this.nodeSubject.value;

        // Conversión fija simulada para el pozo en USD ($1 = 400000000000 o tasa estándar simulada a $1 = 40 VES)
        const equivalentUSD = parseFloat((montoBs / 40).toFixed(2));

        const newTx: PaymentTransaction = {
          id: Math.random().toString(),
          method: 'PAGO_MOVIL',
          user: 'Tú (Propietario)',
          amountVES: montoBs,
          reference: Math.floor(100000 + Math.random() * 900000).toString(),
          status: 'SUCCESS',
          date: new Date()
        };

        this.transactionsSubject.next([newTx, ...currentTransactions]);
        this.nodeSubject.next({
          ...currentNode,
          currentFundsUSD: parseFloat((currentNode.currentFundsUSD + equivalentUSD).toFixed(2))
        });

        subscriber.next(true);
        subscriber.complete();
      }, 1500);
    });
  }

  processBinancePay(binanceId: string, montoUSDT: number): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      // Simula el tiempo de respuesta de la Blockchain / API de Binance Pay
      setTimeout(() => {
        const currentTransactions = this.transactionsSubject.value;
        const currentNode = this.nodeSubject.value;

        const newTx: PaymentTransaction = {
          id: Math.random().toString(),
          method: 'BINANCE_PAY',
          user: 'Tú (Propietario)',
          amountUSDT: montoUSDT,
          reference: Math.floor(10000000 + Math.random() * 90000000).toString(),
          status: 'SUCCESS',
          date: new Date()
        };

        this.transactionsSubject.next([newTx, ...currentTransactions]);
        this.nodeSubject.next({
          ...currentNode,
          currentFundsUSD: parseFloat((currentNode.currentFundsUSD + montoUSDT).toFixed(2))
        });

        subscriber.next(true);
        subscriber.complete();
      }, 1200);
    });
  }

  // ================= PUNTO 3: DESCARGAS PREDICTIVAS (INTERNET HOSTIL) =================
  startPredictiveDownload(movieId: number): void {
    const currentProgress = this.downloadProgressSubject.value;
    if (currentProgress[movieId] !== undefined) return; // Ya se está descargando o ya bajó

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      const progressMap = { ...this.downloadProgressSubject.value };
      progressMap[movieId] = progress;
      this.downloadProgressSubject.next(progressMap);

      if (progress >= 100) {
        clearInterval(interval);
        // Agregar a la lista de películas listas offline
        const currentDownloaded = this.downloadedMoviesSubject.value;
        this.downloadedMoviesSubject.next([...currentDownloaded, movieId]);
      }
    }, 400); // Sube 10% cada 400ms simulando una ráfaga alta de conexión
  }

  // ================= PUNTO 4: TRUEQUE DE DATOS COMUNITARIOS =================
  toggleDataSharing(active: boolean): void {
    const current = this.nodeSubject.value;
    // Si activa el trueque de datos, simulamos que desbloquea más contenido recomendado para el sector
    const additionalTitles = active ? 15 : -15;
    this.nodeSubject.next({
      ...current,
      dataSharingActive: active,
      unlockedTitlesCount: current.unlockedTitlesCount + additionalTitles
    });
  }

}
