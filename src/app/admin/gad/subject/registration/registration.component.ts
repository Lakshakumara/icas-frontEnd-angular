import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Member } from 'src/app/Model/member';
import { Role } from 'src/app/Model/role';

import { AuthServiceService } from 'src/app/service/auth-service.service';

import { FormBuilder, FormGroup } from '@angular/forms';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { Claim } from 'src/app/Model/claim';
import { Constants } from 'src/app/util/constants';
import { SharedService } from 'src/app/shared/shared.service';
import { VoucherNewComponent } from '../../voucher-new/voucher-new.component';

@Component({
  selector: 'app-sub_registration',
  templateUrl: './r.html', //member-manage//registration.component
  styleUrls: ['./r.css'],
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  @Input() voucherIds!: number[];
  @Output() doVoucher = new EventEmitter();
  showFullProfile = false;
  profilePhotoUrl: string = 'assets/images/blank-profile.webp'; // Default placeholder image
  loggeduser: any;
  selectedMember!: Member | null;
  selectedClaim!: Claim | null;
  viewMode: string = 'memberDetails'; // State variable to control view
  panelTitle: string = 'Members Data';
  status_mecApproved: string = Constants.CLAIMSTATUS_MEDICAL_DECISION_APPROVED;
  
 // @Output() sidenavClose = new EventEmitter();

  //claims: Claim[] | undefined;
  //dataSource!: MemberDataSource;
  //currentYear = Utils.currentYear;
  //displayedColumn: string[] = Member_Column_Accept.map((col) => col.key);
  //columnsSchema: any = Member_Column_Accept;
  //access = Access_type;
  roleGroup!: FormGroup;
  roleData = [
    { item_id: 1, role: Constants.ROLE_USER },
    { item_id: 2, role: Constants.ROLE_ADMIN },
    { item_id: 3, role: Constants.ROLE_GAD_HEAD },
    { item_id: 4, role: Constants.ROLE_DEP_HEAD },
    { item_id: 5, role: Constants.ROLE_MO },
    { item_id: 6, role: Constants.ROLE_MEC },
    { item_id: 7, role: Constants.ROLE_SUPER_ADMIN },
  ];
  dropdownSettings: IDropdownSettings = {};
  selectedRoles!: any[];
  tobeUpdated!: any;
  //searchControl: FormControl = new FormControl();
  //totalLength = 0;
  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;
  panelOpenState = false;

  
  selectedvoucherId!: number | undefined;
  @ViewChild(VoucherNewComponent) voucherNewComponent!: VoucherNewComponent;
  
  constructor(
    private share: SharedService,
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthServiceService,
    private buildr: FormBuilder
  ) {}

  ngOnInit() {
    this.loggeduser = this.share.getUser();
    //if (this.loggeduser == null) this.router.navigate(['/signin']);
    this.roleGroup = this.buildr.group({
      selectedRoles: [''],
    });
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'role',
      enableCheckAll: false,
    };
    /*this.roleData = [
      { item_id: 1, role: Constants.ROLE_USER },
      { item_id: 2, role: Constants.ROLE_ADMIN },
      { item_id: 3, role: Constants.ROLE_GAD_HEAD },
      { item_id: 4, role: Constants.ROLE_DEP_HEAD },
      { item_id: 5, role: Constants.ROLE_MO },
      { item_id: 6, role: Constants.ROLE_MEC },
      { item_id: 7, role: Constants.ROLE_SUPER_ADMIN },
    ];*/
  }
  ngAfterViewInit() {}

  getMember(member: any) {
    this.selectedMember = member;
    this.selectedRoles = [];
    const rr: Role[] = this.selectedMember!.roles;
    rr.forEach((r) => {
      if (r.role == Constants.ROLE_USER)
        this.selectedRoles.push({ item_id: 1, role: Constants.ROLE_USER });
      else if (r.role == Constants.ROLE_ADMIN)
        this.selectedRoles.push({ item_id: 2, role: Constants.ROLE_ADMIN });
      else if (r.role == Constants.ROLE_GAD_HEAD)
        this.selectedRoles.push({
          item_id: 3,
          role: Constants.ROLE_GAD_HEAD,
        });
      else if (r.role == Constants.ROLE_DEP_HEAD)
        this.selectedRoles.push({
          item_id: 4,
          role: Constants.ROLE_DEP_HEAD,
        });
      else if (r.role == Constants.ROLE_MO)
        this.selectedRoles.push({ item_id: 5, role: Constants.ROLE_MO });
      else if (r.role == Constants.ROLE_MEC)
        this.selectedRoles.push({ item_id: 6, role: Constants.ROLE_MEC });
      else if (r.role == Constants.ROLE_SUPER_ADMIN)
        this.selectedRoles.push({
          item_id: 7,
          role: Constants.ROLE_SUPER_ADMIN,
        });
    });
    console.log('selectedRoles ', this.selectedRoles);
    /*const selectedRoles = this.selectedMember?.roles.map(role => {
        return this.roleData.find(item => item.role === role);
      }).filter(role => role !== undefined);
      
      console.log('Selected Roles:', selectedRoles);*/
    this.roleGroup.patchValue({
      selectedRoles: [this.selectedRoles],
      //selectedRoles: this.selectedMember!.roles.map(role => this.roleData.find(item => item.role === role))
    });

    console.log('roleGroup ', this.roleGroup.value);
    /*this.roleGroup = this.buildr.group({
        selectedRoles: [this.selectedRoles],
      });*/
  }

  getClaim(claim: Claim) {
    this.selectedClaim = claim;
    this.selectedMember = claim.member;
  }
  toggleProfile() {
    this.showFullProfile = !this.showFullProfile;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.profilePhotoUrl;
  }

  showClaimManage() {
    this.selectedClaim = null
    this.viewMode = 'claimManage';
    this.panelTitle = 'Claim Manage';
  }

  showSetPayment(){
    this.viewMode = 'setPayment';
    this.panelTitle = `Claim ID ${this.selectedClaim!.id}`;
  }
  showVoucherGeneration() {
    this.selectedMember = null;
    this.viewMode = 'voucherGeneration';
    this.panelTitle = 'Voucher Generation';
  }
  showClaimHistory() {
    this.viewMode = 'claimHistory';
    this.panelTitle = 'Claim History';
  }

  showPaymentHistory() {
    this.viewMode = 'paymentHistory';
    this.panelTitle = 'Paymeny History';
  }

  showAddNewUser() {
    this.selectedMember = null;
    this.viewMode = 'newUser';
    this.panelTitle = 'New User';
  }
  showBeneficiaryData() {
    this.viewMode = 'beneficiaryData';
    this.panelTitle = 'Benificiary and Dependant details';
  }

  showMemberDetails() {
    this.viewMode = 'memberDetails';
    this.panelTitle = 'Members Data';
  }

  goBack() {
    if (this.viewMode == 'memberDetails') this.selectedMember = null;
    this.showMemberDetails();
    this.changeDetectorRef.detectChanges();
  }

  roleUpdate() {
    if (this.selectedMember == undefined) return;
    const x = this.roleGroup.value.selectedRoles as Array<Role>;
    console.log(
      'this.roleGroup.value.selectedRoles ',
      this.roleGroup.value.selectedRoles
    );
    this.tobeUpdated = {
      criteria: 'role',
      memberId: this.selectedMember?.id,
      empNo: this.selectedMember?.empNo,
      newrole: x.map((r) => {
        return r.role;
      }),
    };

    console.log(this.tobeUpdated);
    this.auth.update('role', this.tobeUpdated).subscribe((data) => {
      Swal.fire({
        icon: 'info',
        title: 'Roles Updated',
        text: 'Success',
      });
    });
  }
  getvoucherIds(id:number[]){
    this.voucherIds = id
  }
  showVoucher() {
    Constants.Toast.fire('Under Construction');
  }
  /*downloadVoucher():any{
    Constants.Toast.fire('Under Construction');
    this.doVoucher.emit(true);
    return null;
  }*/
  public downloadVoucher(): void {
    if (this.voucherNewComponent) {
      this.voucherNewComponent.downloadVoucher(this.selectedvoucherId!);
    } else {
      console.error('VoucherNewComponent not available');
    }
  }
  /*initializeTable() {
    this.dataSource = new MemberDataSource(this.auth);
  }
  
  setupTableFeatures() {
    this.changeDetectorRef.detectChanges();
    this.dataSource.sort = this.sort;
    this.loadMemberPage('');
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadMemberPage('')))
      .subscribe();

    this.dataSource.loading$.subscribe((loading) => {
      if (!loading) {
        this.totalLength = this.dataSource.totalCount;
      }
    });
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        distinctUntilChanged() // Only emit when value is different from previous value
      )
      .subscribe((value) => {
        this.paginator.pageIndex = 0;
        const filterValue = value.trim().toLowerCase();
        this.loadMemberPage(filterValue);
      });
  }

  loadMemberPage(filter: string) {
    this.dataSource.loadMember(
      Constants.ALL,
      null,
      filter,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  reNew = this.buildr.group({
    year: this.buildr.control(this.currentYear + 1, [Validators.required]),
    selector: this.buildr.control(''),
  });

  formGroup = this.buildr.group({
    empNo: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    address: new FormControl(),
    email: new FormControl(),
    contactNo: new FormControl(),
    nic: new FormControl(),
    designation: new FormControl(),
    department: new FormControl(),
    password: new FormControl(),
    roles: new FormControl(),
    mDate: new FormControl(),
    status: new FormControl(),
  });

  registerProcess() {
    this.formGroup.patchValue({
      mDate: new Date(),
      status: Constants.REGISTRATION_PENDING,
    });
    this.auth
      .registerold(this.formGroup.value)
      .subscribe((response: any) => {});
  }

  clearReg() {
    this.formGroup.reset();
  }

 

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  registrationOpen() {
    if (this.reNew.value.selector !== 'all') {
      this.reNew.patchValue({
        selector: this.selectedMember?.empNo,
      });
    }
    this.auth.update('registerOpen', this.reNew.value).subscribe((data) => {
      Swal.fire({
        icon: 'info',
        title: 'Sucess',
        text: 'Updated ' + data + 'rows',
      });
    });
  }
*/
}
