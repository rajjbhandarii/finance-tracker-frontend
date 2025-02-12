import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-budget-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-management.component.html',
  styleUrls: ['./budget-management.component.css'],
})
export class BudgetManagementComponent {
  budgets: { category: string; amount: number; spent: number }[] = [];
  newBudget = { category: 'food', amount: 10 };

  private apiBudgetUrl = environment.apiBudgetUrl;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getbudget()
  }

  addBudget() {
    if (this.newBudget.category && this.newBudget.amount > 0 && this.budgets.filter(b => b.category === this.newBudget.category).length === 0) {
      const newBudgetItem = {
        category: this.newBudget.category,
        amount: this.newBudget.amount,
        spent: 0
      };
      this.budgets.push(newBudgetItem);
      this.http.post(this.apiBudgetUrl, newBudgetItem).subscribe((response: any) => {
        alert('Budget added successfully !');

        // Reset form fields
        // this.newBudget = { category: 'food', amount: 10 };
      });
    }
  }

  removeBudget(response: any) {
    this.http.delete(this.apiBudgetUrl + '/' + response.id).subscribe((response: any) => {
      alert('Budget removed successfully !');
    });

  }
  getbudget() {
    this.http.get(this.apiBudgetUrl).subscribe((response: any) => {
      this.budgets = response;
    });
  }

  getBudgetProgress(budget: any) {
    return (budget.spent / budget.amount) * 100;
  }
}
