import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { LayoutComponent } from '../layout/layout.component';
import { DashboardComponent } from '../dash-board/dash-board.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';
import { BudgetManagementComponent } from '../budget-management/budget-management.component';
import { AnalyticsComponent } from '../analytics/analytics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'add-transaction', component: AddTransactionComponent },
      { path: 'transaction-list', component: TransactionListComponent },
      { path: 'budget', component: BudgetManagementComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
];
