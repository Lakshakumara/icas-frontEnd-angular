export interface Scheme {
  isSelected: boolean;
  id: number;
  idText: string;
  title: string;
  descriptionen: string;
  descriptionsi: string;
  descriptionta: string;
  amount: number;
  unit: string;
  rate: number;
  isEdit: boolean;
}
export interface SchemeTitles {
  id: string;
  idText: string[];
  description: string;
}
export const SchemeColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: 'idText',
    type: 'text',
    label: 'Cascade ID',
    required: true,
  },
  {
    key: 'title',
    type: 'text',
    label: 'Title',
    required: true,
  },
  {
    key: 'descriptionen',
    type: 'text',
    label: 'Description English',
    required: true,
  },
  {
    key: 'descriptionsi',
    type: 'text',
    label: 'Description Sinhala',
    required: true,
  },
  {
    key: 'descriptionta',
    type: 'text',
    label: 'Description Samil',
    required: true,
  },
  {
    key: 'amount',
    type: 'number',
    label: 'Amount',
  },
  {
    key: 'unit',
    type: 'text',
    label: 'Unit',
  },
  {
    key: 'rate',
    type: 'number',
    label: 'Rate',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: 'Actions',
  },
];
