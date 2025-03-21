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
    label: 'Claim ID',
  },
  {
    key: 'empNo',
    type: 'text',
    label: 'Emp NO',
  },
  {
    key: 'name',
    type: 'text',
    label: 'Name',
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
    key: 'claimDate',
    type: 'text',
    label: 'Date',
  },
  {
    key: 'requestFor',
    type: 'text',
    label: 'Request',
  },
  {
    key: 'requestAmount',
    type: 'currency',
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
    key: 'claimDate',
    type: 'text',
    label: 'Claim Date',
  },
  {
    key: 'requestFor',
    type: 'text',
    label: 'Request For',
  },
  {
    key: 'requestAmount',
    type: 'currency',
    label: 'Request Amount',
  },
];

export const Claim_Data_Review = [
  {
    key: 'id',
    type: 'number',
    label: 'ID',
  },
  {
    key: 'title',
    type: 'text',
    label: 'Title',
  },
  {
    key: 'claimDataStatus',
    type: 'text',
    label: 'MEC Status',
  },
  {
    key: 'requestAmount',
    type: 'currency',
    label: 'Request Amount',
  },
  {
    key: 'deductionAmount',
    type: 'currency',
    label: 'Deduction',
  },
  {
    key: 'deductionRemarks',
    type: 'text',
    label: 'Deduction Remarks',
  },
  {
    key: 'rejectedDate',
    type: 'Date',
    label: 'Rejected Date',
  },
  {
    key: 'rejectRemarks',
    type: 'text',
    label: 'Rejected Remarks',
  },
  {
    key: 'paidAmount',
    type: 'currency',
    label: 'Elligible Amount',
  },
  {
    key: 'remarks',
    type: 'text',
    label: 'Remarks',
  },
];
export const Claim_History = [
  {
    key: 'category',
    type: 'text',
    label: 'Category',
  },
  {
    key: 'maxAmount',
    type: 'currency',
    label: 'Max Amount',
  },
  {
    key: 'itemCount',
    type: 'text',
    label: 'Item Count',
  },
  {
    key: 'totalPaid',
    type: 'currency',
    label: 'Total Paid',
  },
];
