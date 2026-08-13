export type InvoiceStatus = 
  | 'PENDING' 
  | 'NEGOTIATING_DISCOUNT' 
  | 'DISPUTED_BUG' 
  | 'PAID' 
  | 'REJECTED';

export interface DisputeReport {
  issueDescription: string;
  proofOfWorkUrl?: string;
  reportedAt: Date;
}

export interface Invoice {
  id: string;
  amount: number;
  currentDiscountPercent: number;
  clientEmail: string;
  clientSlack?: string;
  clientPhone?: string;
  description: string;
  status: InvoiceStatus;
  dispute?: DisputeReport;
  createdAt: Date;
}
