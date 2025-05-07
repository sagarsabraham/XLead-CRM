import { Component } from '@angular/core';
import { TopcardComponent } from '../topcard/topcard.component';

@Component({
  selector: 'app-pipelinepage',
  templateUrl: './pipelinepage.component.html',
  styleUrls: ['./pipelinepage.component.css']
})
export class PipelinepageComponent {
  topcardData = [
    { amount: 120000, title: 'Total Return', isCurrency: true, icon: 'money' },
    { amount: 14, title: 'Total Count of Deals', isCurrency: false, icon: 'mediumiconslayout' },
  ]; 

}
