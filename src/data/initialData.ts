import { ComplaintTicket, Technician, ServiceCentre, UserAccount, SystemSettings } from '../types';

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'Suresh Patel',
    mobile: '9826145620',
    specialties: ['LED TV', 'Smart TV', 'Audio System', 'Motherboard Repair'],
    companyLoginNumber: 'LG-KB-402 (LG GSFS Portal)',
    status: 'Active',
    defaultHomeCommission: 350,
    totalJobsAssigned: 42,
    totalCompleted: 38
  },
  {
    id: 'tech-2',
    name: 'Rakesh Verma',
    mobile: '9425238910',
    specialties: ['Refrigerator', 'Inverter Split AC', 'Deep Freezer', 'Cooler'],
    companyLoginNumber: 'SAM-KBA-190 (Samsung GSPN)',
    status: 'On Field',
    defaultHomeCommission: 450,
    totalJobsAssigned: 56,
    totalCompleted: 51
  },
  {
    id: 'tech-3',
    name: 'Manoj Yadav',
    mobile: '9752311488',
    specialties: ['Washing Machine', 'Microwave Oven', 'Dishwasher'],
    companyLoginNumber: 'WP-KRB-881 (Whirlpool OneCare)',
    status: 'Active',
    defaultHomeCommission: 400,
    totalJobsAssigned: 31,
    totalCompleted: 29
  },
  {
    id: 'tech-4',
    name: 'Deepak Dewangan',
    mobile: '8817765230',
    specialties: ['PCB Level Repair', 'Inverter PCB', 'General Electronics'],
    companyLoginNumber: 'VOL-KB-911 (Voltas CRM)',
    status: 'Active',
    defaultHomeCommission: 300,
    totalJobsAssigned: 27,
    totalCompleted: 24
  }
];

export const INITIAL_SERVICE_CENTRES: ServiceCentre[] = [
  {
    id: 'sc-1',
    name: 'Samsung Authorized Service Plaza Korba',
    authorizedBrands: ['Samsung'],
    contactPerson: 'Arun Dewangan',
    phone: '07759-245100',
    address: 'Shop No. 14, Commercial Complex, Transport Nagar, Korba, CG',
    companyLoginNumber: 'SAM-SVC-CG04-89'
  },
  {
    id: 'sc-2',
    name: 'LG Care Hub Korba & Bilaspur Region',
    authorizedBrands: ['LG'],
    contactPerson: 'Vikram Joshi',
    phone: '07759-228711',
    address: 'Near Old Bus Stand, Kosabadi Main Road, Korba, CG',
    companyLoginNumber: 'LG-ASP-495677'
  },
  {
    id: 'sc-3',
    name: 'Voltas & Beko Regional Care Centre',
    authorizedBrands: ['Voltas', 'Beko'],
    contactPerson: 'Sanjay Rathore',
    phone: '9826312450',
    address: 'Opp. Power House, Budhwari Bypass, Korba, CG',
    companyLoginNumber: 'VOLT-CEN-KB-201'
  },
  {
    id: 'sc-4',
    name: 'Whirlpool & Godrej Multi-Brand Authorized Desk',
    authorizedBrands: ['Whirlpool', 'Godrej', 'Haier'],
    contactPerson: 'Pradeep Sharma',
    phone: '9424155230',
    address: 'Plot 4, Indira Stadium Road, Transport Nagar, Korba, CG',
    companyLoginNumber: 'MBD-KB-772'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-1',
    name: 'Rajesh Singh',
    role: 'Admin',
    mobile: '9826199880',
    title: 'Owner & Managing Director'
  },
  {
    id: 'user-2',
    name: 'Amit Verma',
    role: 'Staff',
    mobile: '9179044550',
    title: 'Service Manager & Ticket Desk'
  },
  {
    id: 'user-3',
    name: 'Priya Sharma',
    role: 'Staff',
    mobile: '9630122340',
    title: 'Front Office & Billing Executive'
  },
  {
    id: 'user-4',
    name: 'Suresh Patel',
    role: 'Staff',
    mobile: '9826145620',
    title: 'Senior Field Technician'
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  shopName: 'Singh Electronics, Korba',
  shopAddress: 'Plot No. 12, Main Road, Near Old Bus Stand, Kosabadi, Korba, Chhattisgarh - 495677',
  shopPhone: '+91 98261 99880 / 07759-224488',
  shopEmail: 'singhelectronics.korba@gmail.com',
  shopGstin: '22AALPS4491E1Z8',
  defaultHandlingCharge: 200,
  defaultHomeCommission: 350,
  categories: [
    'LED TV',
    'Smart TV',
    'Refrigerator Single Door',
    'Refrigerator Double Door',
    'Washing Machine Semi-Automatic',
    'Washing Machine Fully-Automatic',
    'Inverter Split AC',
    'Window AC',
    'Microwave Oven',
    'Air Cooler',
    'Inverter & Battery',
    'Water Purifier / RO'
  ],
  brands: [
    'Samsung',
    'LG',
    'Sony',
    'Whirlpool',
    'Voltas',
    'Godrej',
    'Haier',
    'Panasonic',
    'Daikin',
    'Lloyd',
    'Philips',
    'Havells',
    'OnePlus',
    'Mi / Xiaomi'
  ]
};

export const INITIAL_TICKETS: ComplaintTicket[] = [
  {
    id: 'SEK-2026-1042',
    ticketNumber: 'SEK-2026-1042',
    date: '2026-09-30',
    createdAt: '2026-09-30T10:15:00Z',
    customerName: 'Anil Kumar Agrawal',
    mobile: '9827155601',
    alternateMobile: '9424166702',
    address: 'Quarter No. C-45, NTPC Township, Jamnipali, Korba',
    area: 'Jamnipali NTPC',
    productCategory: 'LED TV',
    brand: 'LG',
    model: '43UQ7550PSF 4K Ultra HD',
    serialNumber: '908LGRKB7721',
    problemDescription: 'Sound is coming clearly but display screen is completely dark. Backlight flickering observed before black screen.',
    warrantyStatus: 'Out of Warranty',
    productLocation: 'Shop',
    complaintType: 'Shop Repair',
    accessoriesReceived: ['Original Magic Remote', 'Power Cable', 'Desktop Stand Legs'],
    remarks: 'Customer brought to shop. No physical crack on outer glass panel.',
    attachments: [
      {
        id: 'att-1',
        name: 'tv_front_inspection.jpg',
        url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=400&q=80',
        type: 'photo',
        timestamp: '2026-09-30T10:20:00Z'
      }
    ],
    companyLoginNumber: 'LG-KB-402',
    status: 'Parts Pending',
    assignedType: 'technician',
    assignedTechnicianId: 'tech-1',
    assignedAt: '2026-09-30T11:00:00Z',
    diagnosis: {
      faultFound: 'Backlight LED strip array burnt (3 strips burnt out of 4). Motherboard backlight driver IC healthy.',
      estimateAmount: 2600,
      technicianNotes: 'Needs genuine LG original replacement LED strip set (43-inch 8-LED). Ordered from Raipur distributor.',
      partsRequired: [
        {
          id: 'part-1',
          partName: 'LG 43-inch Backlight Strip Kit (Set of 3)',
          partCost: 1100,
          status: 'Ordered',
          orderDate: '2026-09-30',
          trackingNo: 'DELHIVERY-CG-991823'
        }
      ],
      tentativeReadyDate: '2026-10-02'
    },
    customerApproval: {
      status: 'Approved',
      approvedAmount: 2600,
      approvedAt: '2026-09-30T14:30:00Z',
      remarks: 'Customer agreed on phone call for Rs. 2600 with 3 months backlight warranty.'
    },
    billing: {
      repairType: 'Shop',
      technicianCost: 1100,
      customerAmount: 2600,
      handlingCharge: 200,
      technicianCommission: 0,
      grossMargin: 1300,
      paymentStatus: 'Partial',
      paidAmount: 1000,
      balanceAmount: 1600,
      payments: [
        {
          id: 'pay-1',
          date: '2026-09-30',
          amount: 1000,
          mode: 'UPI',
          referenceNo: 'UPI/627401928410/GPay',
          collectedBy: 'Priya Sharma',
          notes: 'Advance deposit received at counter'
        }
      ]
    },
    delivery: {
      isReady: false,
      isCustomerInformed: false,
      deliveryStatus: 'Not Ready'
    },
    followUp: {
      followUpDate: '2026-10-01',
      notes: 'Check courier delivery for LED strips by 2 PM today'
    },
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-09-30T10:15:00Z',
        action: 'Complaint Registered',
        userName: 'Priya Sharma',
        userRole: 'Staff',
        details: 'Ticket SEK-2026-1042 created with advance of Rs 1000.'
      },
      {
        id: 'tl-2',
        timestamp: '2026-09-30T11:00:00Z',
        action: 'Assigned to Technician',
        userName: 'Amit Verma',
        userRole: 'Staff',
        details: 'Assigned to Suresh Patel. Sent job details on WhatsApp.'
      },
      {
        id: 'tl-3',
        timestamp: '2026-09-30T14:00:00Z',
        action: 'Diagnosis Entered',
        userName: 'Suresh Patel',
        userRole: 'Staff',
        details: 'Diagnosed LED strip failure. Estimate Rs 2600.'
      },
      {
        id: 'tl-4',
        timestamp: '2026-09-30T14:30:00Z',
        action: 'Customer Approved Estimate',
        userName: 'Amit Verma',
        userRole: 'Staff',
        details: 'Customer approved repair cost.'
      },
      {
        id: 'tl-5',
        timestamp: '2026-09-30T15:10:00Z',
        action: 'Status Changed to Parts Pending',
        userName: 'Amit Verma',
        userRole: 'Staff',
        previousStatus: 'Customer Approval Pending',
        newStatus: 'Parts Pending',
        details: 'Spare kit ordered from vendor.'
      }
    ]
  },
  {
    id: 'SEK-2026-1043',
    ticketNumber: 'SEK-2026-1043',
    date: '2026-09-29',
    createdAt: '2026-09-29T11:40:00Z',
    customerName: 'Sunita Dewangan',
    mobile: '9425510294',
    alternateMobile: '7759248100',
    address: 'MIG-22, Housing Board Colony, Kosabadi, Korba',
    area: 'Kosabadi',
    productCategory: 'Refrigerator Double Door',
    brand: 'Samsung',
    model: 'RT28T3722S8/HL 253L Inverter',
    serialNumber: 'SN-SAM-REF-4091',
    problemDescription: 'Freezer is working fine but lower refrigerator compartment is not cooling. Food items getting spoiled.',
    warrantyStatus: 'Out of Warranty',
    productLocation: 'Customer Home',
    complaintType: 'Home Visit',
    accessoriesReceived: ['None (At Customer Home)'],
    remarks: 'Home visit requested in afternoon after 2 PM.',
    attachments: [],
    companyLoginNumber: 'SAM-KBA-190',
    status: 'Customer Approval Pending',
    assignedType: 'technician',
    assignedTechnicianId: 'tech-2',
    assignedAt: '2026-09-29T12:00:00Z',
    diagnosis: {
      faultFound: 'Defrost timer and defrost bimetal sensor faulty; ice accumulation choking airflow ducts to lower cabin.',
      estimateAmount: 1850,
      technicianNotes: 'Requires Samsung genuine defrost bimetal + thermal fuse assembly and duct de-icing.',
      partsRequired: [
        {
          id: 'part-2',
          partName: 'Samsung Bimetal & Defrost Sensor Kit',
          partCost: 650,
          status: 'Available'
        }
      ],
      tentativeReadyDate: '2026-10-01'
    },
    customerApproval: {
      status: 'Pending',
      remarks: 'Waiting for husband return from BALCO shift to confirm Rs 1850 estimate.'
    },
    billing: {
      repairType: 'Home',
      technicianCost: 650,
      customerAmount: 1850,
      handlingCharge: 0,
      technicianCommission: 450,
      grossMargin: 750,
      paymentStatus: 'Unpaid',
      paidAmount: 0,
      balanceAmount: 1850,
      payments: []
    },
    delivery: {
      isReady: false,
      isCustomerInformed: false,
      deliveryStatus: 'Not Ready'
    },
    followUp: {
      followUpDate: '2026-10-01',
      notes: 'Call customer after 11 AM regarding estimate approval'
    },
    timeline: [
      {
        id: 'tl-10',
        timestamp: '2026-09-29T11:40:00Z',
        action: 'Complaint Registered',
        userName: 'Priya Sharma',
        userRole: 'Staff',
        details: 'Home visit logged for Kosabadi.'
      },
      {
        id: 'tl-11',
        timestamp: '2026-09-29T12:00:00Z',
        action: 'Assigned to Technician',
        userName: 'Amit Verma',
        userRole: 'Staff',
        details: 'Assigned to Rakesh Verma.'
      },
      {
        id: 'tl-12',
        timestamp: '2026-09-29T16:20:00Z',
        action: 'Technician Attended & Diagnosed',
        userName: 'Rakesh Verma',
        userRole: 'Staff',
        previousStatus: 'Technician Attended',
        newStatus: 'Customer Approval Pending',
        details: 'Inspection complete at home. Estimate provided.'
      }
    ]
  },
  {
    id: 'SEK-2026-1044',
    ticketNumber: 'SEK-2026-1044',
    date: '2026-09-28',
    createdAt: '2026-09-28T09:10:00Z',
    customerName: 'Mohd. Imran Khan',
    mobile: '9754401928',
    address: 'Near Jama Masjid, Main Market, Transport Nagar, Korba',
    area: 'Transport Nagar',
    productCategory: 'Washing Machine Fully-Automatic',
    brand: 'Whirlpool',
    model: 'Whirlpool 7.5 Kg Stainwash Pro Top Load',
    serialNumber: 'WP-STN-88192',
    problemDescription: 'Water drain motor error (E3 code). Drum vibrates loudly during spin cycle.',
    warrantyStatus: 'Out of Warranty',
    productLocation: 'Shop',
    complaintType: 'Shop Repair',
    accessoriesReceived: ['Inlet Pipe', 'Drain Pipe'],
    remarks: 'Brought by customer to shop on auto-rickshaw.',
    attachments: [],
    companyLoginNumber: 'WP-KRB-881',
    status: 'Ready',
    assignedType: 'technician',
    assignedTechnicianId: 'tech-3',
    assignedAt: '2026-09-28T10:00:00Z',
    diagnosis: {
      faultFound: 'Drain pump jammed with safety pins; suspension shocker spring rod worn out.',
      estimateAmount: 2200,
      technicianNotes: 'Drain pump cleaned & serviced. Replaced 4 set suspension rods.',
      partsRequired: [
        {
          id: 'part-3',
          partName: 'Whirlpool Top Load Suspension Rods (4 pcs)',
          partCost: 750,
          status: 'Available'
        }
      ],
      tentativeReadyDate: '2026-09-30'
    },
    customerApproval: {
      status: 'Approved',
      approvedAmount: 2200,
      approvedAt: '2026-09-28T15:00:00Z'
    },
    billing: {
      repairType: 'Shop',
      technicianCost: 750,
      customerAmount: 2200,
      handlingCharge: 200,
      technicianCommission: 0,
      grossMargin: 1250,
      paymentStatus: 'Unpaid',
      paidAmount: 0,
      balanceAmount: 2200,
      payments: []
    },
    delivery: {
      isReady: true,
      readyDate: '2026-09-30T17:00:00Z',
      isCustomerInformed: true,
      customerInformedDate: '2026-09-30T17:30:00Z',
      customerInformedNotes: 'Informed customer on WhatsApp that machine is tested & ready for pickup.',
      deliveryStatus: 'Customer Informed'
    },
    followUp: {
      followUpDate: '2026-10-01',
      notes: 'Customer promised pickup today evening after shop closing'
    },
    timeline: [
      {
        id: 'tl-20',
        timestamp: '2026-09-28T09:10:00Z',
        action: 'Complaint Registered',
        userName: 'Amit Verma',
        userRole: 'Staff'
      },
      {
        id: 'tl-21',
        timestamp: '2026-09-28T15:00:00Z',
        action: 'Customer Approval Received',
        userName: 'Amit Verma',
        userRole: 'Staff',
        details: 'Approved for Rs 2200.'
      },
      {
        id: 'tl-22',
        timestamp: '2026-09-30T17:00:00Z',
        action: 'Repair Completed - Marked Ready',
        userName: 'Manoj Yadav',
        userRole: 'Staff',
        previousStatus: 'Repair in Progress',
        newStatus: 'Ready',
        details: 'Tested for 2 wash-spin cycles without error.'
      },
      {
        id: 'tl-23',
        timestamp: '2026-09-30T17:30:00Z',
        action: 'Customer Informed for Pickup',
        userName: 'Priya Sharma',
        userRole: 'Staff',
        newStatus: 'Customer Informed',
        details: 'WhatsApp notification sent.'
      }
    ]
  },
  {
    id: 'SEK-2026-1045',
    ticketNumber: 'SEK-2026-1045',
    date: '2026-09-25',
    createdAt: '2026-09-25T14:10:00Z',
    customerName: 'Vijay Shankar Tiwari',
    mobile: '9826189912',
    address: 'House No. 104, Balco Sector 2, Korba',
    area: 'Balco Nagar',
    productCategory: 'Inverter Split AC',
    brand: 'Voltas',
    model: '183V Vectra Prism 1.5 Ton 3 Star Inverter',
    serialNumber: 'VOLT-AC-2025-8841',
    problemDescription: 'Indoor unit blowing room temperature air. Error code F3 showing on display panel.',
    warrantyStatus: 'In Warranty',
    productLocation: 'Service Centre',
    complaintType: 'Home Visit',
    accessoriesReceived: ['Bill copy attached'],
    remarks: 'Within 1st year company comprehensive warranty. Requisite company login portal ticket logged.',
    attachments: [
      {
        id: 'att-2',
        name: 'purchase_invoice_voltas.pdf',
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
        type: 'bill',
        timestamp: '2026-09-25T14:15:00Z'
      }
    ],
    companyLoginNumber: 'VOL-KB-911',
    status: 'Technician/Service Centre Assigned',
    assignedType: 'service_centre',
    assignedServiceCentreId: 'sc-3',
    assignedAt: '2026-09-25T15:00:00Z',
    diagnosis: {
      faultFound: 'PCB outdoor sensor failure; referred to Voltas Authorized Service Centre.',
      technicianNotes: 'Warranty claim verified online. Voltas company engineer assigned.'
    },
    customerApproval: {
      status: 'Approved',
      approvedAmount: 0,
      remarks: 'Zero cost under manufacturer warranty.'
    },
    billing: {
      repairType: 'Home',
      technicianCost: 0,
      customerAmount: 0,
      handlingCharge: 200,
      technicianCommission: 200,
      grossMargin: 0,
      paymentStatus: 'Paid',
      paidAmount: 200,
      balanceAmount: 0,
      payments: [
        {
          id: 'pay-2',
          date: '2026-09-25',
          amount: 200,
          mode: 'Cash',
          collectedBy: 'Amit Verma',
          notes: 'Inspection & warranty logging service charge'
        }
      ]
    },
    delivery: {
      isReady: false,
      isCustomerInformed: true,
      deliveryStatus: 'Not Ready'
    },
    followUp: {
      followUpDate: '2026-09-28', // OVERDUE!
      notes: 'Follow up with Voltas ASC manager Sanjay Rathore regarding parts arrival'
    },
    timeline: [
      {
        id: 'tl-30',
        timestamp: '2026-09-25T14:10:00Z',
        action: 'Complaint Registered',
        userName: 'Amit Verma',
        userRole: 'Staff',
        details: 'Warranty ticket verified.'
      },
      {
        id: 'tl-31',
        timestamp: '2026-09-25T15:00:00Z',
        action: 'Assigned to Service Centre',
        userName: 'Amit Verma',
        userRole: 'Staff',
        details: 'Referred to Voltas Regional Care Centre Korba.'
      }
    ]
  },
  {
    id: 'SEK-2026-1046',
    ticketNumber: 'SEK-2026-1046',
    date: '2026-09-27',
    createdAt: '2026-09-27T16:00:00Z',
    customerName: 'Pooja Kashyap',
    mobile: '9131092834',
    address: 'Near Durga Temple, Risdi, Korba',
    area: 'Risdi',
    productCategory: 'Microwave Oven',
    brand: 'LG',
    model: 'MH2044DB 20L Grill Microwave',
    serialNumber: 'LG-MW-9012',
    problemDescription: 'Heavy sparking and burning smell when heating starts. Turntable rotating normally.',
    warrantyStatus: 'Out of Warranty',
    productLocation: 'Shop',
    complaintType: 'Shop Repair',
    accessoriesReceived: ['Glass Turntable Plate', 'Roller Ring'],
    remarks: 'Internal cavity mica sheet burnt.',
    attachments: [],
    companyLoginNumber: 'LG-KB-402',
    status: 'Payment Pending',
    assignedType: 'technician',
    assignedTechnicianId: 'tech-4',
    assignedAt: '2026-09-27T16:30:00Z',
    diagnosis: {
      faultFound: 'Burnt waveguide mica cover and damaged high voltage magnetron connector.',
      estimateAmount: 1400,
      technicianNotes: 'Replaced mica sheet and high voltage diode; repaired magnetron antenna.',
      partsRequired: [
        {
          id: 'part-4',
          partName: 'Mica Sheet & HV Diode Kit',
          partCost: 400,
          status: 'Available'
        }
      ],
      tentativeReadyDate: '2026-09-29'
    },
    customerApproval: {
      status: 'Approved',
      approvedAmount: 1400,
      approvedAt: '2026-09-27T18:00:00Z'
    },
    billing: {
      repairType: 'Shop',
      technicianCost: 400,
      customerAmount: 1400,
      handlingCharge: 200,
      technicianCommission: 0,
      grossMargin: 800,
      paymentStatus: 'Unpaid',
      paidAmount: 0,
      balanceAmount: 1400,
      payments: []
    },
    delivery: {
      isReady: true,
      readyDate: '2026-09-29T14:00:00Z',
      isCustomerInformed: true,
      customerInformedDate: '2026-09-29T15:00:00Z',
      customerInformedNotes: 'Customer informed of repair completion. Promised pickup tomorrow.',
      deliveryStatus: 'Delivery Pending'
    },
    followUp: {
      followUpDate: '2026-10-01',
      notes: 'Customer coming to collect today'
    },
    timeline: [
      {
        id: 'tl-40',
        timestamp: '2026-09-27T16:00:00Z',
        action: 'Complaint Registered',
        userName: 'Priya Sharma',
        userRole: 'Staff'
      },
      {
        id: 'tl-41',
        timestamp: '2026-09-29T14:00:00Z',
        action: 'Repair Completed',
        userName: 'Deepak Dewangan',
        userRole: 'Staff',
        newStatus: 'Payment Pending'
      }
    ]
  },
  {
    id: 'SEK-2026-1047',
    ticketNumber: 'SEK-2026-1047',
    date: '2026-09-24',
    createdAt: '2026-09-24T11:00:00Z',
    customerName: 'Sanjay Deshmukh',
    mobile: '9827114400',
    address: 'Near CSEB Grid Station, Darri, Korba',
    area: 'Darri',
    productCategory: 'LED TV',
    brand: 'Sony',
    model: 'Bravia 55X75K 4K Google TV',
    serialNumber: 'SNY-55-9921',
    problemDescription: '6 times red light blinking on standby LED. TV automatically shuts off after 5 seconds.',
    warrantyStatus: 'Out of Warranty',
    productLocation: 'Shop',
    complaintType: 'Shop Repair',
    accessoriesReceived: ['Original Voice Remote', 'Power Adapter 19.5V'],
    remarks: 'Motherboard processor power rail shorting.',
    attachments: [],
    companyLoginNumber: '',
    status: 'Delivered',
    assignedType: 'technician',
    assignedTechnicianId: 'tech-1',
    assignedAt: '2026-09-24T12:00:00Z',
    diagnosis: {
      faultFound: 'Backlight inverter feedback line dry solder and 19.5V regulator capacitor leakage.',
      estimateAmount: 3500,
      technicianNotes: 'SMD components replaced on main power converter section. Thermal paste reapplied.'
    },
    customerApproval: {
      status: 'Approved',
      approvedAmount: 3500,
      approvedAt: '2026-09-24T16:00:00Z'
    },
    billing: {
      repairType: 'Shop',
      technicianCost: 1400,
      customerAmount: 3500,
      handlingCharge: 200,
      technicianCommission: 0,
      grossMargin: 1900,
      paymentStatus: 'Paid',
      paidAmount: 3500,
      balanceAmount: 0,
      payments: [
        {
          id: 'pay-3',
          date: '2026-09-26',
          amount: 3500,
          mode: 'UPI',
          referenceNo: 'UPI/PhonePe/9921820',
          collectedBy: 'Rajesh Singh',
          notes: 'Full payment on delivery'
        }
      ]
    },
    delivery: {
      isReady: true,
      readyDate: '2026-09-26T12:00:00Z',
      isCustomerInformed: true,
      customerInformedDate: '2026-09-26T12:30:00Z',
      deliveryStatus: 'Delivered',
      deliveryDate: '2026-09-26T17:30:00Z',
      deliveredBy: 'Amit Verma',
      deliveredTo: 'Sanjay Deshmukh (Self)',
      deliveryRemarks: 'Delivered in good condition with tested picture quality. 30 days shop warranty on PCB.'
    },
    followUp: {
      isResolved: true
    },
    timeline: [
      {
        id: 'tl-50',
        timestamp: '2026-09-24T11:00:00Z',
        action: 'Complaint Registered',
        userName: 'Amit Verma',
        userRole: 'Staff'
      },
      {
        id: 'tl-51',
        timestamp: '2026-09-26T17:30:00Z',
        action: 'Payment Received & Delivered',
        userName: 'Rajesh Singh',
        userRole: 'Admin',
        newStatus: 'Delivered',
        details: 'Payment Rs 3500 received via UPI. Delivered to customer.'
      }
    ]
  },
  {
    id: 'SEK-2026-1048',
    ticketNumber: 'SEK-2026-1048',
    date: '2026-09-22',
    createdAt: '2026-09-22T10:00:00Z',
    customerName: 'Hemant Lal Sahu',
    mobile: '9926810234',
    address: 'Gitanjali Vihar, Budhwari, Korba',
    area: 'Budhwari',
    productCategory: 'Air Cooler',
    brand: 'Havells',
    model: 'Havells Celia Desert Cooler 55L',
    serialNumber: 'HVL-CLR-2201',
    problemDescription: 'Pump motor burnt. Fan motor running slow with hum sound.',
    warrantyStatus: 'Out of Warranty',
    productLocation: 'Shop',
    complaintType: 'Shop Repair',
    accessoriesReceived: ['Cooler Body', 'Wheels attached'],
    remarks: 'Replaced submersible water pump & capacitor.',
    attachments: [],
    companyLoginNumber: '',
    status: 'Closed',
    assignedType: 'technician',
    assignedTechnicianId: 'tech-4',
    assignedAt: '2026-09-22T11:00:00Z',
    diagnosis: {
      faultFound: 'Submersible pump open circuit. Fan 4uF capacitor degraded.',
      estimateAmount: 950,
      technicianNotes: 'Repaired and water tested.'
    },
    customerApproval: {
      status: 'Approved',
      approvedAmount: 950
    },
    billing: {
      repairType: 'Shop',
      technicianCost: 350,
      customerAmount: 950,
      handlingCharge: 150,
      technicianCommission: 0,
      grossMargin: 450,
      paymentStatus: 'Paid',
      paidAmount: 950,
      balanceAmount: 0,
      payments: [
        {
          id: 'pay-4',
          date: '2026-09-23',
          amount: 950,
          mode: 'Cash',
          collectedBy: 'Priya Sharma'
        }
      ]
    },
    delivery: {
      isReady: true,
      readyDate: '2026-09-23T11:00:00Z',
      isCustomerInformed: true,
      customerInformedDate: '2026-09-23T11:30:00Z',
      deliveryStatus: 'Delivered',
      deliveryDate: '2026-09-23T16:00:00Z',
      deliveredBy: 'Amit Verma',
      deliveredTo: 'Hemant Lal Sahu',
      deliveryRemarks: 'Closed after customer satisfaction and payment receipt.'
    },
    followUp: {
      isResolved: true
    },
    timeline: [
      {
        id: 'tl-60',
        timestamp: '2026-09-22T10:00:00Z',
        action: 'Complaint Registered',
        userName: 'Priya Sharma',
        userRole: 'Staff'
      },
      {
        id: 'tl-61',
        timestamp: '2026-09-23T16:00:00Z',
        action: 'Delivered & Closed',
        userName: 'Priya Sharma',
        userRole: 'Staff',
        newStatus: 'Closed',
        details: 'Payment collected in full and delivered.'
      }
    ]
  },
  {
    id: 'SEK-2026-1049',
    ticketNumber: 'SEK-2026-1049',
    date: '2026-10-01',
    createdAt: '2026-10-01T09:30:00Z',
    customerName: 'Kavita Patel',
    mobile: '9826133445',
    address: 'Near City Mall, Transport Nagar, Korba',
    area: 'Transport Nagar',
    productCategory: 'Inverter Split AC',
    brand: 'Daikin',
    model: 'FTKM50U 1.5 Ton 5 Star Inverter',
    serialNumber: 'DKN-AC-90114',
    problemDescription: 'Water leaking from indoor unit inside the bedroom. Cooling is moderate.',
    warrantyStatus: 'Out of Warranty',
    productLocation: 'Customer Home',
    complaintType: 'Home Visit',
    accessoriesReceived: ['None'],
    remarks: 'Customer requested technician visit today afternoon between 12-2 PM.',
    attachments: [],
    companyLoginNumber: '',
    status: 'Complaint Received',
    assignedType: 'unassigned',
    diagnosis: {
      partsRequired: []
    },
    customerApproval: {
      status: 'Pending'
    },
    billing: {
      repairType: 'Home',
      technicianCost: 0,
      customerAmount: 600,
      handlingCharge: 0,
      technicianCommission: 350,
      grossMargin: 250,
      paymentStatus: 'Unpaid',
      paidAmount: 0,
      balanceAmount: 600,
      payments: []
    },
    delivery: {
      isReady: false,
      isCustomerInformed: false,
      deliveryStatus: 'Not Ready'
    },
    followUp: {
      followUpDate: '2026-10-01',
      notes: 'Assign technician by 11:30 AM for afternoon visit'
    },
    timeline: [
      {
        id: 'tl-70',
        timestamp: '2026-10-01T09:30:00Z',
        action: 'Complaint Received',
        userName: 'Amit Verma',
        userRole: 'Staff',
        details: 'New complaint logged at counter for home service.'
      }
    ]
  }
];
