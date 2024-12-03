import { Scheme } from "./scheme";

export interface ClaimData{
    id: number,
    scheme: Scheme,
    claimdatastatus:string,
    requestAmount: number,
    deductionAmount: number,
    deductionRemarks: string,
    paidAmount: number,
    remarks: string,
    rejectedDate: Date,
    rejectRemarks: string
    adjustAmount: number,
    adjustRemarks: number,
}