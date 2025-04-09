import { Injectable } from '@angular/core';

import Web3 from 'web3';
import { ethers } from 'ethers';
import { WalletInterface } from '../interfaces/wallet.interface';
//import * as AbiTransactionJson from "../abi/abiTransaction.json";
import abiTransactionJson from '../abi/abiTransaction.json';
import { BehaviorSubject } from 'rxjs';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      // 🔁 Se ejecuta si el usuario cambia de cuenta
      window.ethereum.on('accountsChanged', async () => {
        await this.refreshWallet();
      });
  
      // 🔄 Se ejecuta si el usuario cambia de red
      window.ethereum.on('chainChanged', async () => {
        await this.refreshWallet();
      });
    }
  }

  private walletSubject = new BehaviorSubject<WalletInterface>({ address: '', balance: 0 });
  wallet$ = this.walletSubject.asObservable();

  private provider!: ethers.BrowserProvider;
  private signer!: ethers.JsonRpcSigner;

  async loginWithMetaMask(): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask no está instalado');
      return;
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    await this.refreshWallet();
  }

  private async refreshWallet() {
    if (!this.provider || !this.signer) return;
    const address = await this.signer.getAddress();
    const balanceWei = await this.provider.getBalance(address);
    const balance = parseFloat(ethers.formatEther(balanceWei));
    this.walletSubject.next({ address, balance });
  }

  walletInterface: WalletInterface = { address: '', balance: 0 };

  // Asegúrate de tener la ABI en el formato correcto
  abiTransactionJson = abiTransactionJson as any; // Normalizamos el tipo para TypeScript

  async sendTransaction(addressFrom: string, addressTo: string, amount: number): Promise<any> {
    try {
      // Configuramos el proveedor de la red (usando MetaMask con ethers.js)
      const provider = new ethers.BrowserProvider(window.ethereum);
  
      // Conectar el proveedor con el firmante de MetaMask (la cuenta que firmará)
      const signer = await provider.getSigner();
  
      // Crear una instancia del contrato inteligente usando el ABI y la dirección del contrato
      const contract = new ethers.Contract(addressTo, this.abiTransactionJson);  //signer
  
      // Convertir el monto de ETH a Wei (unidad más pequeña)
      const amountInWei = ethers.parseEther(amount.toString());
  
      // Enviar la transacción
      const tx = await contract['sendTransaction'](addressTo, amount, {
        from: addressFrom,
        value: ethers.parseEther(amount.toString()) // Convertir wei a ETH
      });

      console.log('Transaction addressFrom: ', addressFrom);
      console.log('Transaction addressTo: ', addressTo);
      console.log('Transaction amount: ', amount);
  
      console.log('Transaction sent: ', tx);
      await tx.wait();  // Esperar la confirmación de la transacción
      console.log('Transaction confirmed: ', tx);
  
    } catch (error) {
      console.error('Error sending remittance:', error);
    }
  }

  async sendTransactionWeb3(addressFrom: string, addressTo: string, ammount: number): Promise<any> {
    window.web3 = new Web3(window.ethereum);
    window.contract = new window.web3.eth.Contract(this.abiTransactionJson, addressTo);
    await window.contract.methods.sendTransaction(addressTo, ammount).send({
      from: addressFrom,
      value: ammount * 1e18
    });
  };


  async changeNetwork(chainIdHex: string): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask no está disponible');
      return;
    }
  
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      // 🔁 Refresca el address y balance al cambiar de red
      await this.refreshWallet();

    } catch (switchError: any) {
      // Si la red no está agregada a MetaMask
      if (switchError.code === 4902) {
        alert('La red no está disponible en MetaMask. Agrega manualmente.');
        // Aquí puedes usar wallet_addEthereumChain si deseas agregarla automáticamente
      } else {
        console.error('Error al cambiar de red:', switchError);
      }
    }
  }


  

}
