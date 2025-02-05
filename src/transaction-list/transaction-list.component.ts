import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent implements OnInit {
  data: any[] = [];
  isloading: boolean = true;
  showDelayMessage: boolean = false;

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getdata();
  }

  getdata() {
    this.http.get(this.apiUrl).subscribe((response: any) => {
      if (this.isloading) {
        this.showDelayMessage = true;
      } else {
        this.showDelayMessage = false;
      }
      this.data = response;
      this.isloading = false;
    });
  }

  deletRow(response: any) {
    this.http.delete(this.apiUrl + '/' + response.id).subscribe((response: any) => {
      this.getdata();
    });
  }
}