import { CommonModule } from '@angular/common';
import { Component, numberAttribute, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { of } from 'rxjs';

@Component({
  selector: 'app-budget-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget-management.component.html',
  styleUrls: ['./budget-management.component.css'],
})
export class BudgetManagementComponent implements OnInit {
  budgets: { category: string; amount: number; spent: number }[] = [];
  newBudget = { category: '', amount: 0 };
  spent: { description: string; amount: number; }[] = [];

  private apiBudgetUrl = environment.apiBudgetUrl;
  private apiDataUrl = environment.apiDataUrl;

  constructor(private http: HttpClient) {
    this.getBudget();
    this.getSpent();
  }

  ngOnInit(): void {
    this.getBudgetProgress(this.spent[0].description);
    this.getBudget();
  };

  addBudget() {
    if (this.newBudget.category && this.newBudget.amount > 0 && this.budgets.filter(b => b.category === this.newBudget.category).length === 0) {
      const newBudgetItem = {
        category: this.newBudget.category,
        amount: this.newBudget.amount,
        spent: 0
      };
      this.budgets.push(newBudgetItem);
      this.http.post(this.apiBudgetUrl, newBudgetItem).subscribe(() => {
        alert('Budget added successfully !');

        // Reset form fields
        // this.newBudget = { category: '', amount: 0 };
      });

    }
  }

  getBudget() {
    this.http.get(this.apiBudgetUrl).subscribe((response: any) => {
      console.log("budgets response", response)
      this.budgets = response;
      console.log("constrctor budget", this.budgets);
    });
  }

  getSpent() {
    this.http.get(this.apiDataUrl).subscribe((response: any) => {
      console.log("spent response", response)
      this.spent = response.map((item: any) => {
        return {
          description: item.description,
          amount: item.amount
        };
      });
      console.log("constructor spent", this.spent);
    });
  }

  removeBudget(response: any) {
    console.log(response.id);
    this.http.delete(this.apiBudgetUrl + '/' + response.id).subscribe(() => {
      alert('Budget removed successfully !');
      this.getBudget();
    });
  }

  getBudgetProgress(category: string): number {
    const budgetItem = this.budgets.find(b => b.category.toLocaleLowerCase() === category.toLocaleLowerCase());//compare the category(parameter) with the budget category
    const spentItem = this.spent.find(s => s.description.toLocaleLowerCase() === category.toLocaleLowerCase());//compare the category(parameter) with the spent category
    console.log("budgetItem", budgetItem);
    console.log("spentItem", spentItem);
    if (budgetItem && spentItem) {
      return (spentItem.amount / budgetItem.amount) * 100;
    }
    return 0;
  }

}