import { Component, Input } from '@angular/core';
import { DealbodyComponent } from '../dealbody/dealbody.component';
import { DealcardComponent } from '../dealcard/dealcard.component';
import { DealheaderComponent } from '../dealheader/dealheader.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TopcardComponent } from '../topcard/topcard.component';


import { DealfooterComponent } from '../dealfooter/dealfooter.component';
import { ExportComponent } from '../../export/export.component';

@Component({
  selector: 'app-pipelinepage',
  imports: [DealbodyComponent, DealcardComponent, DealheaderComponent, CommonModule,TopcardComponent, DealfooterComponent, SharedModule, ExportComponent],
  templateUrl: './pipelinepage.component.html',
  styleUrl: './pipelinepage.component.css'
})
export class PipelinepageComponent {
  topcardData = [
    { amount: 120000, title: 'Total Return', isCurrency: true, icon: 'attach_money' },
    { amount: 14, title: 'Total Count of Deals', isCurrency: false, icon: 'swap_vert' },
  ]; 
  stages = [
    { 
      name: 'Qualification', 
      amount: '$ 1,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$1,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        }
      ]
    },
    { 
      name: 'Need Analysis', 
      amount: '$ 6,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'EV Vehicle Display',
          amount: '$1,000.00',
          date: '3 Jun 2025',
          boName: 'Hitachi',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$5,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        }
      ]
    },
    { 
      name: 'Proposal/Price Quote', 
      amount: '$ 10,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$10,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        }
      ]
    },
    { 
      name: 'Negotiation/Review', 
      amount: '$ 3,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$1,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$2,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        }
      ]
    },
    { 
      name: 'Closed Won', 
      amount: '$ 10,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$5,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$3,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$2,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        }
      ]
    },
    { 
      name: 'Closed Lost', 
      amount: '$ 5,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        },
        {
          title: 'Harley Davidson Screen',
          amount: '$5,000.00',
          date: '3 Jun 2025',
          boName: 'KniTT (BAYADA Home Health)',
          department: 'DU-4',
          probability: '50%',
          region: 'US'
        }
      ]
    }
  ]
  // navItems = [
  //   {
  //     iconPath: 'assets/Pipeline.png',
  //     text: 'Pipelines',
  //     route: '/pipelines',
  //     isActive: true,
  //   },
  //   {
  //     iconPath: 'assets/Contact.png',
  //     text: 'Contacts',
  //     route: '/contacts',
  //     isActive: false,
  //   },
  //   {
    
  //     iconPath: 'assets/Company.png',
  //     text: 'Companies',
  //     route: '/companies',
  //     isActive: false,
  //   },
  //   {
  //     iconPath: 'assets/Dashboard.png',
  //     text: 'Dashboard',
  //     route: '/dashboard',
  //     isActive: false,
  //   },
  // ];

  // profile = {
  //   name: 'Subhash K Joseph',
  //   role: 'Admin',
  // };

  icons = [
    'assets/Pipeline.png',
    'assets/Contact.png',
    'assets/Company.png',
    'assets/Dashboard.png',
  ];

  name = 'Subhash K Joseph';
  role = 'Admin';

  get connectedDropLists(): string[] {
    return this.stages.map(stage => stage.name);
  }

  toggleCollapse(index: number) {
    this.stages[index].collapsed = !this.stages[index].collapsed;
  }

  onMouseEnter(index: number) {
    this.stages[index].hover = true;
  }

  onMouseLeave(index: number) {
    this.stages[index].hover = false;
  }

  onDealDropped(event: { previousStage: string, currentStage: string, previousIndex: number, currentIndex: number }) {
    const { previousStage, currentStage, previousIndex, currentIndex } = event;

    const previousDeals = this.stages.find(s => s.name === previousStage)?.deals;
    const currentDeals = this.stages.find(s => s.name === currentStage)?.deals;

    if (previousDeals && currentDeals) {
      const [movedItem] = previousDeals.splice(previousIndex, 1);
      currentDeals.splice(currentIndex, 0, movedItem);
    }
  }

  onAddDeal() {
    console.log('Add Deal clicked');
  }
}