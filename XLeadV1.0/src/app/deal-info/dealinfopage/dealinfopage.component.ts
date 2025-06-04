import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dealinfopage',
  templateUrl: './dealinfopage.component.html',
  styleUrls: ['./dealinfopage.component.css']
})
export class DealinfopageComponent implements OnInit {
  deal: any = null;
  history: { timestamp: string; editedBy: string; fromStage: string; toStage: string }[] = [];
  isMobile: boolean = false;

  desktopSelectedTabId: string = 'history'; // Default for desktop
  mobileSelectedTabId: string = 'deal-stage';

  mobileTabs = [
    { text: 'Deal Stage', id: 'deal-stage' },
    { text: 'Deal Info', id: 'deal-info' },
    { text: 'History', id: 'history' },
    { text: 'Documents', id: 'documents' },
    { text: 'Notes', id: 'notes' }  // Added notes tab here
  ];

  desktopTabs = [
    { text: 'History', id: 'history' },
    { text: 'Documents', id: 'documents' },
    { text: 'Notes', id: 'notes' }  // Added notes tab here too
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.checkScreenSize();

    const navigation = this.router.getCurrentNavigation();
    let dealData = navigation?.extras?.state?.['deal'];

    if (!dealData && history.state.deal) {
      dealData = history.state.deal;
    }

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
    this.deal.contactEmail = `${this.deal.contactName.replace(/\s+/g, '.').toLowerCase()}@example.com`;
    this.deal.contactPhone = '+919847908657';
    this.deal.companyWebsite = `info@${this.deal.companyName.toLowerCase()}.com`;
    this.deal.companyPhone = '+917745635467';

    this.history.push({
      timestamp: new Date().toLocaleString(),
      editedBy: this.deal.salesperson,
      fromStage: 'None',
      toStage: this.deal.stage
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile && (this.mobileSelectedTabId === '' || this.mobileSelectedTabId === 'history' || this.mobileSelectedTabId === 'documents')) {
      this.mobileSelectedTabId = 'deal-stage';
    }
    if (!this.isMobile && (this.desktopSelectedTabId === '' || this.desktopSelectedTabId === 'deal-stage' || this.desktopSelectedTabId === 'deal-info')) {
      this.desktopSelectedTabId = 'history';
    }
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
    console.log('History updated:', this.history);
  }

  onDescriptionChange(newDescription: string) {
    console.log('Updated description:', newDescription);
    this.deal.description = newDescription;
  }

  onDesktopTabSelect(e: any) {
    this.desktopSelectedTabId = e.itemData.id;
  }
}
