type DocumentType = 'RUC' | 'DNI' | 'CE';
type ProductType = 'VISA';
type Currency = 'PEN' | 'USD';

interface ICustomer {
  documentType: DocumentType;
  documentNumber: string;
  fullName: string;
  age: number;
  email: string;
}

interface IProduct {
  type: ProductType;
  currency: Currency;
}

export interface ICardIssue {
  id: string;
  customer: ICustomer;
  product: IProduct;
  status: string;
  forceError: boolean;
}

export interface ICardIssueRepository {
  save(cardIssue: Omit<ICardIssue, 'id' | 'status'>): Promise<ICardIssue>;
}

export interface ICardIssueService {
  create(cardIssue: Omit<ICardIssue, 'id' | 'status'>): Promise<Pick<ICardIssue, 'id' | 'status'>>;
}
