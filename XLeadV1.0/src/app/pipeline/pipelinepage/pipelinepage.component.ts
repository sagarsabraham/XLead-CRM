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
      amount: '$ 1,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
          amount: '$1,000.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
      amount: '$ 6,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'EV Vehicle Display',
          amount: '$1,000.00',
          date: '3 Jun 2025',
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
          amount: '$5,000.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
          amount: '$50.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
      amount: '$ 10,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$10,000.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
          amount: '$50.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
      amount: '$ 3,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Harley Davidson Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
          amount: '$1,000.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
          amount: '$2,000.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
      amount: '$ 8,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
          amount: '$5,000.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
          amount: '$3,000.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
      amount: '$ 5,050.00', 
      collapsed: false,
      hover: false,
      deals : [
        {
          title: 'Display Screen',
          amount: '$50.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
          amount: '$5,000.00',
          date: '3 Jun 2025',
          department: 'DU-4',
          probability: '50',
          region: 'US',
          salesperson: 'John Doe',
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
    const targetStage = this.stages.find(stage => stage.name === newDeal.stage);
    if (targetStage) {
      const dealData = {
        title: newDeal.title,
        amount: newDeal.amount,
        date: newDeal.date,
        department: newDeal.department,
        probability: newDeal.probability,
        region: newDeal.region,
        salesperson: newDeal.salesperson,
        companyName: newDeal.companyName,
        account: newDeal.account,
        contactName: newDeal.contactName,
        domain: newDeal.domain,
        revenueType: newDeal.revenueType,
        country: newDeal.country,
        description: newDeal.description,
        doc: newDeal.doc
      };
      targetStage.deals.push(dealData);
      const totalAmount = targetStage.deals.reduce((sum, deal) => {
        const amount = parseFloat(deal.amount.replace('$', '').replace(',', ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      targetStage.amount = `$ ${totalAmount.toFixed(2)}`;
      // Update total return in topcardData (sum of all deal amounts across all stages)
      const totalReturn = this.stages.reduce((total, stage) => {
        const stageAmount = stage.deals.reduce((sum, deal) => {
          const amount = parseFloat(deal.amount.replace('$', '').replace(',', ''));
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        return total + stageAmount;
      }, 0);
      this.topcardData[0].amount = totalReturn;
      // Update total count of deals
      this.topcardData[1].amount = this.stages.reduce((total, stage) => total + stage.deals.length, 0);
    }
    this.onModalClose();
  }
}