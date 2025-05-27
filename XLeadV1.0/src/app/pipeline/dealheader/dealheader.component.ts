import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dealheader',
  templateUrl: './dealheader.component.html',
  styleUrls: ['./dealheader.component.css']
})
export class DealheaderComponent {
  @Input() stageName: string = '';
  @Input() amount: number = 0;
  @Input() dealCount: number = 0;
  @Input() collapsed: boolean = false;
}