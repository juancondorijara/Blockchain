import { Routes } from '@angular/router';

import { WalletComponent } from '../components/wallet/wallet.component';

//export const routes: Routes = [];

export const routes: Routes = [
    { path: '', redirectTo: '/wallet', pathMatch: 'full' },
    { path: 'wallet', component: WalletComponent }
];
  