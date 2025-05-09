<<<<<<< HEAD
import { Component ,Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-topcard',
  imports: [MatCardModule,CommonModule,MatIconModule],
  templateUrl: './topcard.component.html',
  styleUrl: './topcard.component.css'
=======
import { Component } from '@angular/core';
import { Input} from '@angular/core';


@Component({
  selector: 'app-topcard',
  templateUrl: './topcard.component.html',
  styleUrls: ['./topcard.component.css']
>>>>>>> 4e45b8485d42a584bd0c353be48a5ebe0c430f51
})
export class TopcardComponent {
  @Input() amount: number = 0;
  @Input() title: string = '';
  @Input() isCurrency: boolean = false;
  @Input() icon: string = '';
<<<<<<< HEAD
}
=======

}
>>>>>>> 4e45b8485d42a584bd0c353be48a5ebe0c430f51
