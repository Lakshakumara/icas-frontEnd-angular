import { Registration } from './registration';
import { Dependant } from './dependant';
import { Beneficiary } from './benificiary';
import { Role } from './role';
import { Claim } from './claim';

export interface Member {
  id: number;
  empNo: string;
  name: string;
  address: string;
  email: string;
  contactNo: string;
  civilStatus: string;
  nic: string;
  sex: string;
  dob: Date;
  designation: string;
  department: string;
  status: string;
  photoUrl: string;
  roles: Role[];

  password: string;
  mDate: Date;
  scheme: string;
  deleted: boolean;
  currentRegistration: Registration;
  memberRegistrations: Registration[];
  dependants: Dependant[];
  beneficiaries: Beneficiary[];
  registrationOpen:number
}

export const Member_Column_Accept = [
  {
    key: 'isSelected',
    type: 'boolean',
    label: '',
  },
  {
    key: 'empNo',
    type: 'text',
    label: 'EmNo',
  },
  {
    key: 'designation',
    type: 'text',
    label: 'Designation',
  },
  {
    key: 'name',
    type: 'text',
    label: 'Employee Name',
  },
  {
    key: 'department',
    type: 'text',
    label: 'Department',
  },
];
