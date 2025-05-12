import { Component } from '@angular/core';
import { Input} from '@angular/core';


@Component({
  selector: 'app-topcard',
  templateUrl: './topcard.component.html',
  styleUrls: ['./topcard.component.css']
})
export class TopcardComponent {
  @Input() amount: number = 0;
  @Input() title: string = '';
  @Input() isCurrency: boolean = false;
  @Input() icon: string = '';

}
