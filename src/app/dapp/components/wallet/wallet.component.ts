import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { WalletService } from '../../services/wallet.service';
import { WalletInterface } from '../../interfaces/wallet.interface';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, AsyncPipe],
  //providers: [WalletService],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent {

  wallet$ = this.walletService.wallet$;

  selectedNetwork = '0x1';
  networks = [
    { name: 'Ethereum Mainnet', chainId: '0x1' },
    { name: 'Sepolia', chainId: '0xaa36a7' },
    { name: 'Holesky', chainId: '0x4268' }
  ];

  constructor(private walletService: WalletService) {}

  connect() {
    this.walletService.connectWallet();
  }

  changeNetwork() {
    this.walletService.switchNetwork(this.selectedNetwork);
  }



  recipient = '';
  amount = '';
  txHash = '';
  error = '';

  async send() {
    this.txHash = '';
    this.error = '';
    try {
      const tx = await this.walletService.sendEth(this.recipient, this.amount);
      this.txHash = tx.hash;
    } catch (err: any) {
      this.error = err?.message || 'Error al enviar ETH';
    }
  }

}
