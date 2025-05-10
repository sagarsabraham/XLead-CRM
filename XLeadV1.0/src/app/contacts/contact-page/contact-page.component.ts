import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent {
   tableHeaders = [
    { dataField: 'name', caption: 'Name' },
    { dataField: 'company', caption: 'Company' },
    { dataField: 'email', caption: 'Email' },
    { dataField: 'phone', caption: 'Phone' },
    { dataField: 'owner', caption: 'Owner', cellTemplate: 'ownerCellTemplate' }
  ];

  tableData = [
    { name: 'John Doe', company: 'Tech Corp', email: 'john@techcorp.com', phone: '123-456-7890', owner: 'Alice' },
    { name: 'Jane Smith', company: 'Innovate Inc', email: 'jane@innovate.com', phone: '234-567-8901', owner: 'Bob' },
    { name: 'Mike Johnson', company: 'Tech Corp', email: 'mike@techcorp.com', phone: '345-678-9012', owner: 'Alice' },
    { name: 'Sarah Williams', company: 'Innovate Inc', email: 'sarah@innovate.com', phone: '456-789-0123', owner: 'Charlie' },
    { name: 'David Brown', company: 'Tech Corp', email: 'david@techcorp.com', phone: '567-890-1234', owner: 'Bob' },
    { name: 'Emily Davis', company: 'Innovate Inc', email: 'emily@innovate.com', phone: '678-901-2345', owner: 'Alice' },
    { name: 'Chris Wilson', company: 'Tech Corp', email: 'chris@techcorp.com', phone: '789-012-3456', owner: 'Charlie' },
    { name: 'Lisa Taylor', company: 'Innovate Inc', email: 'lisa@innovate.com', phone: '890-123-4567', owner: 'Bob' },
    { name: 'Mark Anderson', company: 'Tech Corp', email: 'mark@techcorp.com', phone: '901-234-5678', owner: 'Alice' },
    { name: 'Anna Lee', company: 'Innovate Inc', email: 'anna@innovate.com', phone: '012-345-6789', owner: 'Charlie' },
    { name: 'Tom Clark', company: 'Tech Corp', email: 'tom@techcorp.com', phone: '123-456-7891', owner: 'Bob' },
    { name: 'Laura Evans', company: 'NextGen Ltd', email: 'laura@nextgen.com', phone: '234-567-8902', owner: 'Alice' },
    { name: 'James White', company: 'Tech Corp', email: 'james@techcorp.com', phone: '345-678-9013', owner: 'Bob' },
    { name: 'Rachel Green', company: 'Innovate Inc', email: 'rachel@innovate.com', phone: '456-789-0124', owner: 'Charlie' },
    { name: 'Peter Harris', company: 'NextGen Ltd', email: 'peter@nextgen.com', phone: '567-890-1235', owner: 'Alice' },
    { name: 'Sophie Lewis', company: 'Tech Corp', email: 'sophie@techcorp.com', phone: '678-901-2346', owner: 'Bob' },
    { name: 'Daniel Walker', company: 'Innovate Inc', email: 'daniel@innovate.com', phone: '789-012-3457', owner: 'Charlie' },
    { name: 'Olivia Hall', company: 'NextGen Ltd', email: 'olivia@nextgen.com', phone: '890-123-4568', owner: 'Alice' },
    { name: 'Henry Allen', company: 'Tech Corp', email: 'henry@techcorp.com', phone: '901-234-5679', owner: 'Bob' },
    { name: 'Mia King', company: 'Innovate Inc', email: 'mia@innovate.com', phone: '012-345-6790', owner: 'Charlie' },
    { name: 'Ethan Scott', company: 'NextGen Ltd', email: 'ethan@nextgen.com', phone: '123-456-7892', owner: 'Alice' },
    { name: 'Ava Wright', company: 'Tech Corp', email: 'ava@techcorp.com', phone: '234-567-8903', owner: 'Bob' },
    { name: 'Liam Turner', company: 'Innovate Inc', email: 'liam@innovate.com', phone: '345-678-9014', owner: 'Charlie' },
    { name: 'Isabella Parker', company: 'NextGen Ltd', email: 'isabella@nextgen.com', phone: '456-789-0125', owner: 'Alice' },
    { name: 'Noah Phillips', company: 'Tech Corp', email: 'noah@techcorp.com', phone: '567-890-1236', owner: 'Bob' },
    { name: 'Emma Carter', company: 'Innovate Inc', email: 'emma@innovate.com', phone: '678-901-2347', owner: 'Charlie' },
    { name: 'Mason Edwards', company: 'NextGen Ltd', email: 'mason@nextgen.com', phone: '789-012-3458', owner: 'Alice' },
    { name: 'Charlotte Gray', company: 'Tech Corp', email: 'charlotte@techcorp.com', phone: '890-123-4569', owner: 'Bob' },
    { name: 'Logan James', company: 'Innovate Inc', email: 'logan@innovate.com', phone: '901-234-5680', owner: 'Charlie' },
    { name: 'Amelia Rivera', company: 'NextGen Ltd', email: 'amelia@nextgen.com', phone: '012-345-6791', owner: 'Alice' },
    { name: 'Lucas Bennett', company: 'Tech Corp', email: 'lucas@techcorp.com', phone: '123-456-7893', owner: 'Bob' },
    { name: 'Harper Morris', company: 'Innovate Inc', email: 'harper@innovate.com', phone: '234-567-8904', owner: 'Charlie' },
    { name: 'Evelyn Brooks', company: 'NextGen Ltd', email: 'evelyn@nextgen.com', phone: '345-678-9015', owner: 'Alice' },
    { name: 'Alexander Ward', company: 'Tech Corp', email: 'alexander@techcorp.com', phone: '456-789-0126', owner: 'Bob' },
    { name: 'Abigail Foster', company: 'Innovate Inc', email: 'abigail@innovate.com', phone: '567-890-1237', owner: 'Charlie' },
    { name: 'Benjamin Hayes', company: 'NextGen Ltd', email: 'benjamin@nextgen.com', phone: '678-901-2348', owner: 'Alice' },
    { name: 'Sofia Murphy', company: 'Tech Corp', email: 'sofia@techcorp.com', phone: '789-012-3459', owner: 'Bob' },
    { name: 'Michael Reed', company: 'Innovate Inc', email: 'michael@innovate.com', phone: '890-123-4570', owner: 'Charlie' },
    { name: 'Ella Coleman', company: 'NextGen Ltd', email: 'ella@nextgen.com', phone: '901-234-5681', owner: 'Alice' },
    { name: 'William Perry', company: 'Tech Corp', email: 'william@techcorp.com', phone: '012-345-6792', owner: 'Bob' },
    { name: 'Grace Henderson', company: 'Innovate Inc', email: 'grace@innovate.com', phone: '123-456-7894', owner: 'Charlie' },
    { name: 'Jackson Simmons', company: 'NextGen Ltd', email: 'jackson@nextgen.com', phone: '234-567-8905', owner: 'Alice' },
    { name: 'Lily Watson', company: 'Tech Corp', email: 'lily@techcorp.com', phone: '345-678-9016', owner: 'Bob' },
    { name: 'Aiden Russell', company: 'Innovate Inc', email: 'aiden@innovate.com', phone: '456-789-0127', owner: 'Charlie' },
    { name: 'Chloe Bailey', company: 'NextGen Ltd', email: 'chloe@nextgen.com', phone: '567-890-1238', owner: 'Alice' },
    { name: 'Nathan Fisher', company: 'Tech Corp', email: 'nathan@techcorp.com', phone: '678-901-2349', owner: 'Bob' },
    { name: 'Zoe Gordon', company: 'Innovate Inc', email: 'zoe@innovate.com', phone: '789-012-3460', owner: 'Charlie' },
    { name: 'Gabriel Hunt', company: 'NextGen Ltd', email: 'gabriel@nextgen.com', phone: '890-123-4571', owner: 'Alice' },
    { name: 'Hannah Myers', company: 'Tech Corp', email: 'hannah@techcorp.com', phone: '901-234-5682', owner: 'Bob' },
    { name: 'Isaac Price', company: 'Innovate Inc', email: 'isaac@innovate.com', phone: '012-345-6793', owner: 'Charlie' }
  ];
}
