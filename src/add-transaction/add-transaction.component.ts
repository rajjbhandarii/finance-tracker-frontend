import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css',
})

export class AddTransactionComponent {
  data: any = {
    date: new Date(),
    description: 'ee',
    amount: 1110,
    category: 'Income',
  }
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  submit() {
    this.http.post(this.apiUrl, this.data).subscribe((response: any) => {
      alert('Transaction added successfully !');
      // Reset form fields
      this.data.date = '';
      this.data.description = '';
      this.data.amount = 0;
      this.data.category = '';
    });
  }
}
