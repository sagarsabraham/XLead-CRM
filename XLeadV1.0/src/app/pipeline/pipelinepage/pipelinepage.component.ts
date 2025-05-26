import { Component } from '@angular/core';

@Component({
  selector: 'app-pipelinepage',
  templateUrl: './pipelinepage.component.html',
  styleUrls: ['./pipelinepage.component.css']
})
export class PipelinepageComponent {
  topcardData = [
    {
      amount: 33300,
      title: 'Total Return',
      isCurrency: true,
      icon: 'money',
      iconBackgroundColor: '#ECB985',
      variant: 'default'
    },
    {
      amount: 15,
      title: 'Total Count of Deals',
      isCurrency: false,
      icon: 'sorted',
      iconBackgroundColor: '#ECB985',
      variant: 'default'
    }
  ]; 

  dealButton = [
    { label: 'Deal', icon: 'add'},
  ];

  stages = [
    { 
      name: 'Qualification', 
      amount: 1050, 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: 50,
          startDate: '1 Jun 2025', 
          closeDate: '3 Jun 2025', 
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
          companyName: 'BAYADA',
          account: 'KniTT',
          contactName: 'Jane Smith',
          domain: 'Healthcare',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Screen for healthcare display',
          doc: ''
        },
        {
          title: 'Harley Davidson Screen',
          amount: 1000,
          startDate: '1 Jul 2025',
          closeDate: '3 Jul 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Amily Smith',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'T and M',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        }
      ]
    },
    { 
      name: 'Need Analysis', 
      amount: 6050, 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'EV Vehicle Display',
          amount: 1000,
          startDate: '2 Oct 2025',
          closeDate: '5 Oct 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Alice Brown',
          companyName: 'Hitachi',
          account: '',
          contactName: 'Tom Wilson',
          domain: 'Technology',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'EV display solution',
          doc: ''
        },
        {
          title: 'Harley Davidson Screen',
          amount: 5000,
          startDate: '20 Jul 2025',
          closeDate: '23 Jul 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Shankar Vinay',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'T and M',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        },
        {
          title: 'Harley Davidson Screen',
          amount: 50,
          startDate: '6 Aug 2025',
          closeDate: '9 Aug 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Vinayak Dev',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        }
      ]
    },
    { 
      name: 'Proposal/Price Quote', 
      amount: 10050, 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: 10000,
          startDate: '1 Nov 2025',
          closeDate: '3 Nov 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Mishal',
          companyName: 'BAYADA',
          account: '',
          contactName: 'Jane Smith',
          domain: 'Healthcare',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Screen for healthcare display',
          doc: ''
        },
        {
          title: 'Harley Davidson Screen',
          amount: 50,
          startDate: '5 Jul 2025',
          closeDate: '7 Jul 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Sam Smith',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        }
      ]
    },
    { 
      name: 'Negotiation/Review', 
      amount: 3050, 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Harley Davidson Screen',
          amount: 50,
          startDate: '7 Aug 2025',
          closeDate: '9 Aug 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Vishal Maah',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        },
        {
          title: 'Display Screen',
          amount: 1000,
          startDate: '19 Jun 2025',
          closeDate: '21 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Elizabeth Ann',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'T and M',
          country: 'USA',
          description: 'Custom screen',
          doc: ''
        },
        {
          title: 'Harley Davidson Screen',
          amount: 2000,
          startDate: '28 Jun 2025',
          closeDate: '30 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Ann Mary',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        }
      ]
    },
    { 
      name: 'Closed Won', 
      amount: 8050, 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: 50,
          startDate: '21 Oct 2025',
          closeDate: '23 Oct 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Keziya Kuriyan',
          companyName: 'KniTT',
          account: '(BAYADA Home Health)',
          contactName: 'Jane Smith',
          domain: 'Healthcare',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Screen for healthcare display',
          doc: ''
        },
        {
          title: 'Harley Davidson Screen',
          amount: 5000,
          startDate: '1 Jul 2025',
          closeDate: '3 Jul 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'James Hault',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        },
        {
          title: 'Harley Davidson Screen',
          amount: 3000,
          startDate: '1 Oct 2025',
          closeDate: '3 Oct 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Samual Stephan',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        }
      ]
    },
    { 
      name: 'Closed Lost', 
      amount: 5050, 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: 50,
          startDate: '1 Jun 2024',
          closeDate: '3 Jun 2024',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Agustin Varghese',
          companyName: 'KniTT',
          account: '(BAYADA Home Health)',
          contactName: 'Jane Smith',
          domain: 'Healthcare',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Screen for healthcare display',
          doc: ''
        },
        {
          title: 'Harley Davidson Screen',
          amount: 5000,
          startDate: '21 May 2025',
          closeDate: '23 May 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'Iric James',
          companyName: 'Harley Davidson',
          account: '',
          contactName: 'Mike Johnson',
          domain: 'Automotive',
          revenueType: 'Fixed Fee',
          country: 'USA',
          description: 'Custom screen for Harley',
          doc: ''
        }
      ]
    }
  ];

  // Determine the icon color based on the card index
  getIconColor(index: number): string {
    switch (index) {
      case 0: // First card (Total Return)
        return '#8a2be2'; // Violet
      case 1: // Second card (Total Count of Deals)
        return '#28a745'; // Green
      default:
        return '#e0e0e0'; // Default gray
    }
  }

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
      // console.log('After move:', JSON.stringify(this.stages, null, 2));
      this.updateStageAmounts();
    }
  }
  isModalVisible: boolean = false;
  isEditMode: boolean = false;
  selectedDeal: any = null;
  selectedDealIndex: number = -1;
  selectedStageName: string = '';
  stageNames: string[] = this.stages.map(s => s.name);

  onAddDeal() {
    this.isModalVisible = true; 
    this.isEditMode = false;
    this.selectedDeal = null;
  }

  onEditDeal(deal: any, stageName: string) {
    const stage = this.stages.find(s => s.name === stageName);
    if (stage) {
      const index = stage.deals.indexOf(deal);
      this.selectedDeal = deal;
      this.selectedDealIndex = index;
      this.selectedStageName = stageName;
      this.isEditMode = true;
      this.isModalVisible = true;
    }
  }

   onModalClose() {
    this.isModalVisible = false; 
    this.isEditMode = false;
    this.selectedDeal = null;
    this.selectedDealIndex = -1;
    this.selectedStageName = '';
  }

  onDealSubmit(newDeal: any) {
    if (this.isEditMode) {
      const originalStage = this.stages.find(s => s.name === this.selectedStageName);
      const newStage = this.stages.find(s => s.name === newDeal.stage);
      if (originalStage && this.selectedDealIndex >= 0) {
        const [dealToMove] = originalStage.deals.splice(this.selectedDealIndex, 1);
        Object.assign(dealToMove, newDeal);
        if (newStage) {
          newStage.deals.push(dealToMove);
        } else {
          originalStage.deals.push(dealToMove);
        }
      }
    } else {
      const targetStage = this.stages.find(stage => stage.name === newDeal.stage);
      if (targetStage) {
        targetStage.deals.push(newDeal);
      }
    }
    this.updateStageAmounts();
    this.onModalClose();
  }

  updateStageAmounts() {
    this.stages.forEach(stage => {
      const totalAmount = stage.deals.reduce((sum, deal) => {
        // const amount = parseFloat(deal.amount.replace('$', '').replace(',', ''));
        return sum + (deal.amount || 0);
      }, 0);
      stage.amount = totalAmount;;
    });

    const totalReturn = this.stages.reduce((total, stage) => {
      const stageAmount = stage.deals.reduce((sum, deal) => {
        // const amount = parseFloat(deal.amount.replace('$', '').replace(',', ''));
        return sum + (deal.amount || 0);
      }, 0);
      return total + stageAmount;
    }, 0);
    this.topcardData[0].amount = totalReturn;

    this.topcardData[1].amount = this.stages.reduce((total, stage) => total + stage.deals.length, 0);
  }

  
}