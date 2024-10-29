import { Registration } from './registration';
import { Dependant } from "./dependant";
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
    password: string;
    mDate: Date;
    status: string;
    roles: Role[];
    scheme: string;
    deleted: boolean;
    currentRegistration: Registration;
    memberRegistrations: Registration[];
    dependants: Dependant[];
    beneficiaries: Beneficiary[];
}

export const Member_Column_Accept = [
    {
      key: 'isSelected',
      type: 'boolean',
      label: '',
    },
    {
      key: 'empNo',
      type: 'number',
      label: 'EmNo',
    },
    {
      key: 'name',
      type: 'text',
      label: 'Employee Name',
    }
  ];