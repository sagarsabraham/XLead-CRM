export interface Company {
  companyName: string;
  phoneNo: string;
  website: string;
}

export interface Contact {
  FirstName: string;
  LastName: string;
  companyName: string;
  Email: string;
  phoneNo: string;
}

export interface ContactCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  createdBy: number;
}
export interface CompanyContactMap {
  [companyName: string]: string[]; // or Contact[] if storing objects
}