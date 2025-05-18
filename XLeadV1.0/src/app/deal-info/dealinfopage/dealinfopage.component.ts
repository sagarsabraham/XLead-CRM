import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RelatedInfoService } from 'src/app/shared/services/related-info.service';

@Component({
  selector: 'app-dealinfopage',
  templateUrl: './dealinfopage.component.html',
  styleUrls: ['./dealinfopage.component.css']
})
export class DealinfopageComponent implements OnInit{
  deal: any = null;
  history: { timestamp: string; editedBy: string; fromStage: string; toStage: string }[] = [];

  dealInfo: any[] = [];
  constructor(private dealService: RelatedInfoService) {};

    ngOnInit(): void {
    this.dealService.getDeals().subscribe((response: any) => {
      this.dealInfo = response;
    });
 
  // constructor(private route: ActivatedRoute, private router: Router) { };
  // ngOnInit() {
  //   // In a real app, you'd fetch the deal data from a service using the dealId
  //   // For now, we'll get it from navigation state (passed from DealcardComponent)
  //   const navigation = this.router.getCurrentNavigation();
  //   if (navigation?.extras?.state?.['deal']) {
  //     this.deal = navigation.extras.state['deal'];
  //     // Initialize history with a default entry (e.g., deal creation)
  //     this.history.push({
  //       timestamp: new Date().toLocaleString(),
  //       editedBy: this.deal.salesperson,
  //       fromStage: 'None',
  //       toStage: this.deal.stage
  //     });
  //   } 
  // }
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

  // onDescriptionChange(newDescription: string) {
  //   this.deal.description = newDescription;
  // }
}
