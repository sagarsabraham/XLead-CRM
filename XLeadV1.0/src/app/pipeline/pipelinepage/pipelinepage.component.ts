import { Component } from '@angular/core';


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

  dealButton = [
    { label: 'Deal', icon: 'add'},
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
  isModalVisible: boolean = false;

  stageNames: string[] = this.stages.map(s => s.name);

  onAddDeal() {
    this.isModalVisible = true; 
  }

   onModalClose() {
    this.isModalVisible = false; 
  }

  onDealSubmit(newDeal: any) {
    // Add the new deal to the selected stage
    const targetStage = this.stages.find(stage => stage.name === newDeal.stage);
    if (targetStage) {
      const dealData = {
        title: newDeal.title,
        amount: newDeal.amount,
        date: newDeal.date,
        boName: newDeal.boName,
        department: newDeal.department,
        probability: newDeal.probability,
        region: newDeal.region
      };
      targetStage.deals.push(dealData);
      // Update the stage amount (convert amount to number and sum)
      const totalAmount = targetStage.deals.reduce((sum, deal) => {
        const amount = parseFloat(deal.amount.replace('$', '').replace(',', ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      targetStage.amount = `$ ${totalAmount.toFixed(2)}`;
    }
    this.onModalClose(); // Close the modal after submission
  }
}
