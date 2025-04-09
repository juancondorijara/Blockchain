import { Component, OnInit } from '@angular/core';

import { WalletService } from '../../services/wallet.service';
import { WalletInterface } from '../../interfaces/wallet.interface';
import { CommonModule } from '@angular/common';  // Importar CommonModule si usas ngIf, ngFor, etc
import { FormsModule } from '@angular/forms';    // Importar FormsModule si usas ngModel

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Añadir los módulos que necesitas
  providers: [WalletService],  // Aquí inyectamos el WalletService explícitamente
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit {

  constructor(
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.walletService.wallet$.subscribe(wallet => {
      this.walletInterface = wallet;
    });
  }

  walletInterface: WalletInterface = { address: '', balance: 0 };

  loginWithMetaMask(): void {
    this.walletService.loginWithMetaMask();
  }

  addressTo: string = '';
  balanceTo: number = 0;

  sendTransactionWeb3(): void{
    this.walletService.sendTransactionWeb3(this.walletInterface.address, this.addressTo, this.balanceTo);
    console.log(this.walletInterface.address);
    console.log(this.addressTo);
    console.log(this.balanceTo);
    //this.cleanWallet();
  }

  cleanWallet(): void{
    this.addressTo='';
    this.balanceTo=0;
  }

  changeNetwork(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const chainId = selectElement.value;
  
    if (chainId) {
      this.walletService.changeNetwork(chainId);
    }
  }

}
