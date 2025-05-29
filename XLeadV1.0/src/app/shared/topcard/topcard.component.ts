import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-topcard',
  templateUrl: './topcard.component.html',
  styleUrls: ['./topcard.component.css']
})
export class TopcardComponent {
  @Input() amount: number = 0;
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() iconColor: string = '';
  @Input() variant: 'standard' | 'compact' = 'standard';
  @Input() isCurrency: boolean = false;
}