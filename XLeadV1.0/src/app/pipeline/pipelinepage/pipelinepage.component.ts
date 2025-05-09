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
    { amount: 14, title: 'Total Count of Deals', isCurrency: false, icon: 'sorted' },
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
  ];

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
}
