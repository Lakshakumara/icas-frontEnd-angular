import { ClaimData } from './claimData';
import { Dependant } from './dependant';
import { Member } from './member';

export interface Claim {
  id: number;
  memberId: number;
  empNo: string;
  name: string;
  member: Member;
  dependant: Dependant;

  claimData: ClaimData[];
  category: string;
  requestFor: string;

  injuryDate: Date;
  injuryPlace: string;
  injuryHow: string;
  injuryNature: string;

  illnessDate: Date;
  illnessNature: string;
  illnessFirstConsultDate: Date;
  illnessFirstDr: string;

  hospitalStartDate: Date;
  hospitalEndDate: Date;

  infoTreatment: string;
  infoHospital: string;
  infoConsultant: string;

  claimDate: Date;
  startDate: Date;
  requestAmount: number;

  acceptedDate: Date;
  acceptedBy: number;

  mecSendDate: Date;
  deductionAmount: number;
  paidAmount: number;
  voucherId: number;

  financeSendDate: Date;
  completedDate: Date;

  mecRemarks: string;
  mecReturnDate: Date;
  rejectedDate: Date;
  rejectRemarks: string;

  claimStatus: string;
  remarks: string;

  appeal: boolean;
  appealRefId: number;
  appealRemarks: string;
}
export const Claim_All = [
  {
    key: 'id',
    type: 'number',
    label: 'ID',
  },
  {
    key: 'empNo',
    type: 'text',
    label: 'Emp NO',
  },
  {
    key: 'category',
    type: 'text',
    label: 'Category',
  },
  {
    key: 'claimStatus',
    type: 'text',
    label: 'Status',
  },
  {
    key: 'startDate',
    type: 'string',
    label: 'Date',
  },
  {
    key: 'requestFor',
    type: 'text',
    label: 'Request',
  },
  {
    key: 'requestAmount',
    type: 'number',
    label: 'Request Amount',
  },
];
export const MEC_Column_Accept = [
  {
    key: 'id',
    type: 'number',
    label: 'ID',
  },
  {
    key: 'empNo',
    type: 'text',
    label: 'Emp NO',
  },
  {
    key: 'requestFor',
    type: 'text',
    label: 'Request',
  },
];

export const Claim_Head_Accept = [
  {
    key: 'id',
    type: 'number',
    label: 'ID',
  },
  {
    key: 'member.empNo',
    type: 'text',
    label: 'Emp NO',
  },
  {
    key: 'category',
    type: 'text',
    label: 'Category',
  },
  {
    key: 'startDate',
    type: 'string',
    label: 'Date',
  },
  {
    key: 'requestFor',
    type: 'text',
    label: 'Request',
  },
  {
    key: 'requestAmount',
    type: 'number',
    label: 'Request Amount',
  },
];
