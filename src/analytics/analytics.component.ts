import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';          //for chart
import * as tf from '@tensorflow/tfjs';   //for AI
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {

  totalIncome: number = 0;
  monthlyIncome: number[] = [];
  totalExpenses: number = 0;
  monthlyExpenses: number[] = [];
  balance: number = 0;
  transactionCategories: any[] = [];
  month: number[] = [];
  totalMonths: number = 0;
  year: number[] = [];
  wordMonth: string[] = ['Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',];
  predictedTransactions: any[] = [];
  futurePrediction: number | undefined;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(this.apiUrl).subscribe((fetchedTransactions: any) => {
      this.transactionCategories =
        this.calculateTransactionCategories(fetchedTransactions);
      this.calculateSummary(fetchedTransactions);
      this.getMonthAndYear(fetchedTransactions);
      this.setMonthlyIncome(fetchedTransactions);
      this.setMonthlyExpense(fetchedTransactions);
      (fetchedTransactions.length > 0) ? this.createCharts() : '';

      (this.totalMonths > 0) ? this.trainModel() : '';
    });
  }
  setMonthlyExpense(transactions: any[]) {
    this.monthlyExpenses = [];
    this.month.forEach((month) => {
      const monthlyExpenses = transactions.filter(
        (t) =>
          t.category === 'Expenses' && new Date(t.date).getMonth() + 1 === month
      );
      const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
      this.monthlyExpenses.push(totalExpenses);
    });
  }

  setMonthlyIncome(transactions: any[]) {
    this.monthlyIncome = [];
    this.month.forEach((month) => {
      const monthlyIncome = transactions.filter(
        (t) =>
          t.category === 'Income' && new Date(t.date).getMonth() + 1 === month
      );
      const totalIncome = monthlyIncome.reduce((sum, t) => sum + t.amount, 0);
      this.monthlyIncome.push(totalIncome);
    });
  }

  getMonthAndYear(transactions: any[]) {
    let allMonth = transactions.map(
      (transaction) => new Date(transaction.date).getMonth() + 1
    );
    const filterMonth = [...new Set(allMonth)];
    this.month = filterMonth;

    let allYear = transactions.map(
      (transaction) => new Date(transaction.date).getFullYear()
    );
    const filterYear = [...new Set(allYear)];
    this.year = filterYear;

    this.totalMonths = this.month.length;

  }

  calculateSummary(transactions: any[]) {
    this.totalIncome = transactions
      .filter((t: { category: string }) => t.category === 'Income') // "t" represent incoming transaction
      .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
    this.totalExpenses = transactions
      .filter((t: { category: string }) => t.category === 'Expenses') // "t" represent incoming transaction
      .reduce((sum: any, t: { amount: any; }) => sum + t.amount, 0);
    this.balance = this.totalIncome - this.totalExpenses;
  }

  calculateTransactionCategories(transactions: any[]) {
    const categories: { [key: string]: number } = {};
    transactions.forEach((t) => {
      if (!categories[t.category]) {
        categories[t.category] = 0;
      }
      categories[t.category] += t.amount;
    });
    return Object.keys(categories).map((key) => ({
      name: key,
      total: categories[key],
    }));
  }

  createCharts() {
    const incomeExpenseCtx = document.getElementById(
      'incomeExpenseChart'
    ) as HTMLCanvasElement;

    if (incomeExpenseCtx) {
      new Chart(incomeExpenseCtx, {
        type: 'bar',
        data: {
          labels: ['Income', 'Expenses'],
          datasets: [
            {
              label: 'Amount',
              data: [this.totalIncome, this.totalExpenses],
              backgroundColor: ['#4caf50', '#f44336'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else {
      console.error('Income vs Expenses chart element not found');
    }

    const monthlyTrendsCtx = document.getElementById(
      'monthlyTrendsChart'
    ) as HTMLCanvasElement;
    if (monthlyTrendsCtx) {
      new Chart(monthlyTrendsCtx, {
        type: 'line',
        data: {
          labels: [this.wordMonth[this.month[0] - 1], this.wordMonth[this.month[1] - 1], this.wordMonth[this.month[2] - 1], this.wordMonth[this.month[3] - 1], this.wordMonth[this.month[4] - 1], this.wordMonth[this.month[5] - 1], this.wordMonth[this.month[6] - 1], this.wordMonth[this.month[7] - 1], this.wordMonth[this.month[8] - 1], this.wordMonth[this.month[9] - 1], this.wordMonth[this.month[10] - 1], this.wordMonth[this.month[11] - 1]],
          datasets: [
            {
              label: 'Income Trends',
              data: this.monthlyIncome,
              borderColor: '#42a5f5',
              fill: false,
            },
            {
              label: 'Expense Trends',
              data: this.monthlyExpenses,
              borderColor: '#f44336',
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    } else {
      console.error('Monthly Trends chart element not found');
    }
  }

  async trainModel() {
    for (let i = 0; i < this.totalMonths; i++) {
      this.predictedTransactions.push({ month: i + 1, amount: this.monthlyExpenses[i] });
    }
    const months = this.predictedTransactions.map(t => t.month);
    const amounts = this.predictedTransactions.map(t => t.amount);

    const xs = tf.tensor(months, [months.length, 1]);
    const ys = tf.tensor(amounts, [amounts.length, 1]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    await model.fit(xs, ys, { epochs: 200 });

    // Predict for next month
    const nextMonth = tf.tensor2d([months.length + 1], [1, 1]);
    const prediction = model.predict(nextMonth) as tf.Tensor;

    prediction.data().then(data => {
      this.futurePrediction = data[0];
      console.log(`Predicted expense for next month: ${data[0]}`);
    });
  }

}
