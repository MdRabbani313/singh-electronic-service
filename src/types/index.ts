export type ComplaintStatus =
  | 'Complaint Received'
  | 'Technician/Service Centre Assigned'
  | 'Technician Attended'
  | 'Diagnosis/Estimate Pending'
  | 'Customer Approval Pending'
  | 'Parts Pending'
  | 'Repair in Progress'
  | 'Ready'
  | 'Customer Informed'
  | 'Payment Pending'
  | 'Delivered'
  | 'Closed'
  | 'On Hold';

export type WarrantyStatus = 'In Warranty' | 'Out of Warranty';
export type ProductLocation = 'Shop' | 'Customer Home' | 'Service Centre';
export type ComplaintType = 'Shop Repair' | 'Home Visit';
export type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid';
export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
export type UserRole = 'Admin' | 'Staff';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'bill' | 'photo' | 'fault';
  timestamp: string;
}

export interface PartItem {
  id: string;
  partName: string;
  partCost: number;
  status: 'Available' | 'Ordered' | 'Pending';
  orderDate?: string;
  trackingNo?: string;
}

export interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  mode: PaymentMode;
  referenceNo?: string;
  collectedBy: string;
  notes?: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  action: string;
  userName: string;
  userRole: UserRole;
  details?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface ComplaintTicket {
  id: string;
  ticketNumber: string;
  date: string;
  createdAt: string;
  customerName: string;
  mobile: string;
  alternateMobile?: string;
  address: string;
  area: string;
  productCategory: string;
  brand: string;
  model: string;
  serialNumber?: string;
  problemDescription: string;
  warrantyStatus: WarrantyStatus;
  productLocation: ProductLocation;
  complaintType: ComplaintType;
  accessoriesReceived: string[];
  remarks: string;
  attachments: Attachment[];
  companyLoginNumber?: string; // Company portal job sheet/token/call id (e.g. Samsung/LG/Voltas)
  status: ComplaintStatus;
  assignedType: 'technician' | 'service_centre' | 'unassigned';
  assignedTechnicianId?: string;
  assignedServiceCentreId?: string;
  assignedAt?: string;

  diagnosis: {
    faultFound?: string;
    estimateAmount?: number;
    technicianNotes?: string;
    partsRequired?: PartItem[];
    tentativeReadyDate?: string;
  };

  customerApproval: {
    status: 'Pending' | 'Approved' | 'Rejected' | 'Negotiation';
    approvedAmount?: number;
    approvedAt?: string;
    remarks?: string;
  };

  billing: {
    repairType: 'Shop' | 'Home';
    technicianCost: number;
    customerAmount: number;
    handlingCharge: number;
    technicianCommission: number;
    grossMargin: number; // customerAmount - technicianCost - handlingCharge
    paymentStatus: PaymentStatus;
    paidAmount: number;
    balanceAmount: number;
    payments: PaymentTransaction[];
  };

  delivery: {
    isReady: boolean;
    readyDate?: string;
    isCustomerInformed: boolean;
    customerInformedDate?: string;
    customerInformedNotes?: string;
    deliveryStatus: 'Not Ready' | 'Ready' | 'Customer Informed' | 'Delivery Pending' | 'Delivered';
    deliveryDate?: string;
    deliveredBy?: string;
    deliveredTo?: string;
    deliveryRemarks?: string;
    receiverPhone?: string;
  };

  followUp: {
    followUpDate?: string; // YYYY-MM-DD
    followUpTime?: string;
    notes?: string;
    isResolved?: boolean;
  };

  timeline: TimelineEntry[];
}

export interface Technician {
  id: string;
  name: string;
  mobile: string;
  specialties: string[];
  companyLoginNumber: string; // Brand credentials/portal login ID
  status: 'Active' | 'On Field' | 'Inactive';
  defaultHomeCommission: number;
  totalJobsAssigned?: number;
  totalCompleted?: number;
}

export interface ServiceCentre {
  id: string;
  name: string;
  authorizedBrands: string[];
  contactPerson: string;
  phone: string;
  address: string;
  companyLoginNumber: string; // Portal login / account ID
}

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  mobile: string;
  title: string;
}

export interface SystemSettings {
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopEmail: string;
  shopGstin: string;
  defaultHandlingCharge: number;
  defaultHomeCommission: number;
  categories: string[];
  brands: string[];
}
