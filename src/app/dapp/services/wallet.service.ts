import { Injectable } from '@angular/core';

import { ethers } from 'ethers';
import { WalletInterface } from '../interfaces/wallet.interface';
import { BehaviorSubject } from 'rxjs';
//import * as AbiTransactionJson from "../abi/abiTransaction.json";
import abiTransactionJson from '../abi/abiTransaction.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private walletSubject = new BehaviorSubject<WalletInterface | null>(null);
  wallet$ = this.walletSubject.asObservable();

  private networkNames: Record<string, string> = {
    '0x1': 'Ethereum Mainnet',
    '0xaa36a7': 'Ethereum Sepolia',
    '0x4268': 'Ethereum Holesky',
  };

  async connectWallet(): Promise<void> {
    if (!window.ethereum) {
      alert('MetaMask no está instalado');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    const address = accounts[0];
    const balance = await provider.getBalance(address);
    const network = await provider.getNetwork();

    const chainHex = '0x' + network.chainId.toString(16);

    this.walletSubject.next({
      address,
      balance: ethers.formatEther(balance),
      chainId: chainHex,
      networkName: this.networkNames[chainHex] || `Desconocida (${chainHex})`
    });
  }

  async switchNetwork(chainId: string): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });

      await this.connectWallet();
    } catch (err: any) {
      alert('No se pudo cambiar la red: ' + err.message);
    }
  }



  private provider!: ethers.BrowserProvider;
  private signer!: ethers.JsonRpcSigner;

  async initProvider(): Promise<void> {
    if (!this.provider) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
    }
  }

  async sendEth(recipient: string, amountInEth: string): Promise<ethers.TransactionResponse> {
    await this.initProvider();

    const tx = await this.signer.sendTransaction({
      to: recipient,
      value: ethers.parseEther(amountInEth)
    });

    return tx;
  }

}
