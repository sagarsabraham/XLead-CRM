import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  stages = [
    { stage: 'Qualification', amount: 3343874 },
    { stage: 'Needs Analysis', amount: 456711 },
    { stage: 'Proposal/Price Quote', amount: 241241 },
    { stage: 'Negotiation/Review', amount: 680000 }
  ];
}