import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-company',
  templateUrl: './top-company.component.html',
  styleUrls: ['./top-company.component.css']
})
export class TopCompanyComponent {
    @Input() companyData: { Account: string; revenue: number }[] = [];

    formatCurrency(value: number): string {
      return '$' + value.toLocaleString('en-US');
    }

}
