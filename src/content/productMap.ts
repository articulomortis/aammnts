export interface ProductMapNode {
  label: string;
  children?: string[];
}

export const productMapRoot = 'Fleet';

export const productMapBranches: ProductMapNode[] = [
  {
    label: 'Home',
    children: ['Dashboard', 'Instant payouts dashboard'],
  },
  {
    label: 'Drivers',
    children: ['Drivers', 'Access management', 'Communications', 'Driver terms', 'Driver recruitment'],
  },
  {
    label: 'Vehicles',
    children: [
      'Vehicle overview',
      'Vehicle report',
      'Vehicles',
      'Charge schedule',
      'Recurring charges',
      'Traffic fines',
      'Carriers',
      'Rent out a car',
      'Yandex Fuel',
    ],
  },
  {
    label: 'Reports',
    children: [
      'Summary reports',
      'Driver segments',
      'Paid driver acquisition',
      'Trips with other fleets',
      'Payouts',
      'Fraud prevention',
      'Fund transfer requests',
      'Statements',
      'Income / Expenses',
      'Order report',
      'Quality',
    ],
  },
  {
    label: 'Map',
  },
  {
    label: 'Products and services',
  },
  {
    label: 'Information',
    children: ['Legal documents', 'News', 'Technical support', 'Knowledge base'],
  },
  {
    label: 'Settings',
    children: [
      'Partner profile',
      'API',
      'Transaction categories',
      'Document templates',
      'Payment systems',
      'Account management',
      'Interface',
    ],
  },
];
