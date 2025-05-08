import { Component ,Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-topcard',
  imports: [MatCardModule,CommonModule,MatIconModule],
  templateUrl: './topcard.component.html',
  styleUrl: './topcard.component.css'
})
export class TopcardComponent {
  @Input() amount: number = 0;
  @Input() title: string = '';
  @Input() isCurrency: boolean = false;
  @Input() icon: string = '';
}