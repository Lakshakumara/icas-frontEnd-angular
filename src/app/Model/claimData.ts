import { Scheme } from "./scheme";

export interface ClaimData{
    id: number,
    scheme: Scheme,
    claimdatastatus:string,
    requestAmount: number,
    deductionAmount: number,
    paidAmount: number,
    remarks: string,
    rejectedDate: Date,
    rejectRemarks: string
}