import { Member } from "./member";

export interface ClaimOPD{
    id:number,
    memberId: number,
    member:Member,
    /**
     * OPD or SHE(Surgical &Hospital Expenses)
     */
    category: string,
    /**
     * Outdoor, Spectacles, covid test etc..
     */
    requestFor: string,
    startDate: Date,
    endDate: Date,
    claimDate: Date,
    applyDate: Date;
    acceptedDate: Date,

    requestAmount: number,
    deductionAmount: number,
    paidAmount: number,
    claimStatus: string,

    claimCount:number,
}

export const OPD_MEC_Column_Accept = [
  {
    key: 'id',
    type: 'number',
    label: 'Claim RNO',
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
    key: 'requestFor',
    type: 'text',
    label: 'Request',
  },
  {
    key: 'startDate',
    type: 'string',
    label: 'Date',
  },
  {
    key: 'requestAmount',
    type: 'number',
    label: 'Request Amount',
  },
  {
    key: 'acceptedDate',
    type: 'date',
    label: 'Accepted',
  },
];
export const UserColumns = [
    {
      key: 'id',
      type: 'number',
      label: 'ID',
    },
    {
      key: 'category',
      type: 'text',
      label: 'Category',
      required: true,
    },
    {
      key: 'requestFor',
      type: 'text',
      label: 'Request',
    },
    {
      key: 'startDate',
      type: 'string',
      label: 'Date',
      required: true,
    },
    {
      key: 'birthDate',
      type: 'date',
      label: 'Date of Birth',
    },
    {
      key: 'isEdit',
      type: 'isEdit',
      label: '',
    },
  ];