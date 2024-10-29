import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Member, Member_Column_Accept } from 'src/app/Model/member';
import { Role, Access_type } from 'src/app/Model/role';
import { MemberDataSource } from '../../../members-dataSource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  merge,
  tap,
} from 'rxjs';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Utils } from 'src/app/util/utils';
import Swal from 'sweetalert2';
import { Claim } from 'src/app/Model/claim';
import { Constants } from 'src/app/util/constants';

@Component({
  selector: 'app-sub_registration',
  templateUrl: './member-manage.html', //registration
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit, AfterViewInit {
  currentYear = Utils.currentYear;
  member: Member | undefined;
  claims: Claim[] | undefined;
  dataSource!: MemberDataSource;
  displayedColumn: string[] = Member_Column_Accept.map((col) => col.key);
  columnsSchema: any = Member_Column_Accept;

  access = Access_type;
  roleGroup!: FormGroup;
  roleData = [{}];
  dropdownSettings: IDropdownSettings = {};
  selectedRoles!: any[];
  tobeUpdated!: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  @Output() sidenavClose = new EventEmitter();
  panelOpenState = false;

  constructor(
    private auth: AuthServiceService,
    private route: ActivatedRoute,
    private buildr: FormBuilder
  ) {}

  ngOnInit() {
    //this.member = this.route.snapshot.data['member'];
    this.dataSource = new MemberDataSource(this.auth);
    this.roleData = [
      { item_id: 1, role: Constants.ROLE_USER },
      { item_id: 2, role: Constants.ROLE_ADMIN },
      { item_id: 3, role: Constants.ROLE_GAD_HEAD },
      { item_id: 4, role: Constants.ROLE_DEP_HEAD },
      { item_id: 5, role: Constants.ROLE_MO },
      { item_id: 6, role: Constants.ROLE_MEC },
      { item_id: 7, role: Constants.ROLE_SUPER_ADMIN },
    ];

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'role',
      enableCheckAll: false,
    };
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit ');
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          //this.paginator.pageIndex = 0;
          this.loadMemberPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator?.page).pipe(
      tap(() => this.loadMemberPage())
    );
  }

  loadMemberPage() {
    let filterValue = this.input.nativeElement.value;
    if (isNaN(Number(filterValue))) {
      this.dataSource.loadMember('name', filterValue);
    } else {
      this.dataSource.loadMember('empNo', filterValue);
    }
  }

  onRowClicked(member: Member) {
    this.member = member;
    this.selectedRoles = [];
    const rr: Role[] = this.member.roles;
    rr.forEach((r) => {
      console.log(this.selectedRoles);
      if (r.role == Constants.ROLE_USER)
        this.selectedRoles.push({ item_id: 1, role: Constants.ROLE_USER });
      else if (r.role == Constants.ROLE_ADMIN)
        this.selectedRoles.push({ item_id: 2, role: Constants.ROLE_ADMIN });
      else if (r.role == Constants.ROLE_GAD_HEAD)
        this.selectedRoles.push({ item_id: 3, role: Constants.ROLE_GAD_HEAD });
      else if (r.role == Constants.ROLE_DEP_HEAD)
        this.selectedRoles.push({ item_id: 4, role: Constants.ROLE_DEP_HEAD });
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

    this.roleGroup = this.buildr.group({
      selectedRoles: [this.selectedRoles],
    });
    this.auth
      .getAllClaims('%', 0, this.member.empNo)
      .subscribe((claim: any) => {
        this.claims = claim;
        this.claims?.sort((a, b) => a.id - b.id);
      });
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
    this.auth.register(this.formGroup.value).subscribe((response: any) => {});
  }

  clearReg() {
    this.formGroup.reset();
  }

  roleUpdate() {
    if (this.member == undefined) return;
    const x = this.roleGroup.value.selectedRoles as Array<Role>;
    console.log(
      'this.roleGroup.value.selectedRoles ',
      this.roleGroup.value.selectedRoles
    );
    this.tobeUpdated = {
      criteria: 'role',
      memberId: this.member?.id,
      empNo: this.member?.empNo,
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
      }).then((result) => {
        this.input.nativeElement.value = this.member?.empNo;
        this.loadMemberPage();
      });
    });
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  registrationOpen() {
    if (this.reNew.value.selector !== 'all') {
      this.reNew.patchValue({
        selector: this.member?.empNo,
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
}
