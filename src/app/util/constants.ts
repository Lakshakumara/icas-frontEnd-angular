import Swal from 'sweetalert2';

export class Constants {
  headPresent: boolean = false;
  static REGISTRATION_PENDING: string = 'pending';
  static REGISTRATION_HEAD_APPROVED: string = 'accepted';
  static REGISTRATION_REJECTED: string = 'Rejected';
  static DEFAULT_PASSWORD: string = 'user';

  static ROLE_USER: string = 'user';
  static ROLE_ADMIN: string = 'admin';
  static ROLE_GAD_HEAD: string = 'GADHead';
  static ROLE_DEP_HEAD: string = 'DepHead';
  static ROLE_MO: string = 'mo';
  static ROLE_MEC: string = 'mec';
  static ROLE_SUPER_ADMIN: string = 'superAdmin';

  static SCHEME_INDIVIDUAL = 'Individual';
  static SCHEME_FAMILY = 'Family';
  static ALL: string = 'All';
  static CATEGORY_OPD: string = 'OPD';
  static CATEGORY_SHE: string = 'Surgical & Hospital Expenses';

  static claimTypes: string[] = [
    'In Patient benefits',
    'Out Patient benefits',
    'Personal Accidents',
    'Spectacles',
    'Critical Illness',
  ];
  static relationShip: string[] = [
    'Father',
    'Mother',
    'Spouce',
    'Daughter',
    'Son',
    'Brother',
    'Sister',
  ];
  static claimCategory: string[] = [
    'ALL',
    Constants.CATEGORY_OPD,
    Constants.CATEGORY_SHE,
  ];
  static CLAIM_STATUS_VIEW: string[] = [
    'All',
    'Pending',
    'Head Approved',
    'MEC',
    'MEC Approved',
    'Rejected',
    'Finance',
    'Paid',
  ];
  static CLAIMSTATUS_ALL: string = '%';
  static CLAIMSTATUS_PENDING: string = 'pending';
  static CLAIMSTATUS_HEAD_APPROVED: string = 'head_approved';
  static CLAIMSTATUS_REJECTED: string = 'rejected';
  static CLAIMSTATUS_MEDICAL_DECISION_PENDING: string = 'mec';
  static CLAIMSTATUS_MEDICAL_DECISION_APPROVED: string = 'mec_approved';
  static CLAIMSTATUS_FINANCE: string = 'finance';
  static CLAIMSTATUS_PAID: string = 'paid';

  get isHeadforClaim(): string {
    return this.headPresent
      ? Constants.CLAIMSTATUS_PENDING
      : Constants.CLAIMSTATUS_HEAD_APPROVED;
  }
  static Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
}
