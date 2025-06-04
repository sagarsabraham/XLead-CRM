import { Component, Input } from '@angular/core';
 
@Component({
  selector: 'app-topcard',
  templateUrl: './topcard.component.html',
  styleUrls: ['./topcard.component.css']
})
export class TopcardComponent {
 @Input() variant: 'standard' | 'compact' = 'standard';
 @Input() amount: number = 0;
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() iconColor: string = '#000000';
  @Input() isCurrency: boolean = false;
}
 