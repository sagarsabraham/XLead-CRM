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
    // Try to get the deal from navigation state
    const navigation = this.router.getCurrentNavigation();
    let dealData = navigation?.extras?.state?.['deal'];

    // Fallback to history.state if navigation state is unavailable
    if (!dealData && history.state.deal) {
      dealData = history.state.deal;
    }

    // If no deal data is found, use mock data for testing
    if (!dealData) {
      dealData = {
        title: 'Display Screen',
        date: '2025-06-03',
        amount: '50',
        companyName: 'KniTT',
        contactName: 'Jane Smith',
        salesperson: 'Business Opportunist',
        stage: 'Qualification',
        description: 'This is a sample deal description.'
      };
    }

    this.deal = dealData;
    // this.deal.amount=dealData.amount.toString();
    this.deal.contactEmail = `${this.deal.contactName.replace(/\s+/g, '.').toLowerCase()}@example.com`;
    this.deal.contactPhone = '+919847908657';
    this.deal.companyWebsite = `info@${this.deal.companyName.toLowerCase()}.com`;
    this.deal.companyPhone = '+917745635467';

    // Initialize history with the initial stage
    this.history.push({
      timestamp: new Date().toLocaleString(),
      editedBy: this.deal.salesperson,
      fromStage: 'None',
      toStage: this.deal.stage
    });
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
    console.log('History updated:', this.history); // Debug log
  }

  onDescriptionChange(newDescription: string) {
    
    console.log('Updated description:', newDescription); // Log the updated description
    this.deal.description = newDescription;
  }

  tabs = [
    { text: 'History', id: 'history' },
    { text: 'Documents', id: 'documents' }
  ];

  selectedTabId = 'history';

  onTabSelect(e: any) {
    this.selectedTabId = e.itemData.id;
  }
}
