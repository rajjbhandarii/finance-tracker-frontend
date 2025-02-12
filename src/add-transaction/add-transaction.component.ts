import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css',
})

export class AddTransactionComponent {
  data: any = {
    date: new Date(),
    description: '',
    amount: 0,
    category: '',
  };

  budget: any = {
    category: '',
    amount: 0,
    spent: 0,
  };

  private apiDataUrl = environment.apiDataUrl;
  private apiBudgetUrl = environment.apiBudgetUrl;

  constructor(private http: HttpClient) { };

  submit() {
    this.http.get<any>(this.apiBudgetUrl).subscribe((response: any) => {
      console.log('Budget API response:', response);
      for (let i = 0; i <= response.length - 1; i++) {
        if (response[i].category === this.data.description) {
          this.budget = response[i];
          break;
        }
      }
      console.log('Budget:', this.budget);
      if (this.data.description.toLowerCase().trim() === this.budget.category.toLowerCase().trim() &&
        this.data.amount > this.budget.amount) {
        alert('Transaction amount is greater than budget amount!');
      } else {
        this.http.post(this.apiDataUrl, this.data).subscribe(() => {
          alert('Transaction added successfully!');
        });
      }
    });
  }
}
