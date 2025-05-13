import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dealinfopage',
  templateUrl: './dealinfopage.component.html',
  styleUrls: ['./dealinfopage.component.css']
})
export class DealinfopageComponent implements OnInit{
  deal: any = null;
  history: { timestamp: string; editedBy: string; fromStage: string; toStage: string }[] = [];

  constructor(private route: ActivatedRoute, private router: Router) { };
  ngOnInit() {
    
  }

  onStageChange(newStage: string) {
    const oldStage = this.deal.stage;
    this.deal.stage = newStage;
    this.history.push({
      timestamp: new Date().toLocaleString(),
      editedBy: this.deal.salesperson,
      fromStage: oldStage,
      toStage: newStage
    });
  }
}
