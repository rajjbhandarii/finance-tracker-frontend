import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css'],
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;
  recentTransactions: any[] = [];
  transactions: any[] = [];

  private apiDataUrl = environment.apiDataUrl;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.calculateTotalIncome();
    this.fetchRecentTransactions();
  }
  calculateTotalIncome() {
    this.http.get(this.apiDataUrl).subscribe((response: any) => {
      console.log(response);
      this.totalIncome = response
        .filter((t: { category: string }) => t.category === 'Income') // "t" represent incoming transaction
        .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
      this.totalExpenses = response
        .filter((t: { category: string }) => t.category === 'Expenses') // "t" represent incoming transaction
        .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
      this.balance = this.totalIncome - this.totalExpenses;
    });
  }

  fetchRecentTransactions() {
    this.http.get(this.apiDataUrl).subscribe((response: any) => {
      this.recentTransactions = response.slice(-5).reverse();
    });
  }
}
