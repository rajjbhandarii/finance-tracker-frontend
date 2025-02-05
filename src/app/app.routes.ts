import { Routes } from '@angular/router';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { DashboardComponent } from '../dash-board/dash-board.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';

export const routes: Routes = [
  { path: 'add-transaction', component: AddTransactionComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'transaction-list', component: TransactionListComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route
];
