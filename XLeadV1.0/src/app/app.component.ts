import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  stages = [
    { stage: 'Qualification', amount: 33438 },
    { stage: 'Needs Analysis', amount: 45671 },
    { stage: 'Proposal/Price Quote', amount: 24124 },
    { stage: 'Negotiation/Review', amount: 68000 }
  ];
}