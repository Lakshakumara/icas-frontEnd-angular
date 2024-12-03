import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Member, Member_Column_Accept } from 'src/app/Model/member';
import { MemberDataSource } from '../../../util/dataSource/members-dataSource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Router } from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged,
  merge,
  tap,
} from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { Utils } from 'src/app/util/utils';
import Swal from 'sweetalert2';
import { Registration } from 'src/app/Model/registration';
import { FormControl } from '@angular/forms';
import { Constants } from 'src/app/util/constants';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent implements OnInit, AfterViewInit {
  loggeduser: any;
  member!: Member | undefined;
  columnsSchema: any = Member_Column_Accept;
  displayedColumn: string[] = Member_Column_Accept.map((col) => col.key);
  regAcceptData!: Registration;
  regAccept: boolean = false;
  dataSource!: MemberDataSource;
  searchControl: FormControl = new FormControl();
  totalLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private auth: AuthServiceService,
    private share: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggeduser = this.share.getUser();
    if (this.loggeduser == null) this.router.navigate(['/signin']);
    this.dataSource = new MemberDataSource(this.auth);
  }

  ngAfterViewInit() {
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
        const filterValue = value.trim().toLowerCase();
        this.sort.active = 'member.name'
        this.loadMemberPage(filterValue);
      });
  }

  loadMemberPage(filter: string) {
    this.member = undefined;
    this.regAccept = false;
    this.dataSource.loadMember(
      Constants.REGISTRATION_PENDING,
      null,
      filter,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  onRowClicked(member: Member) {
    this.member = member;
  }
  acceptRegistration() {
    this.member!.currentRegistration.acceptedDate = new Date();
    this.member!.currentRegistration.acceptedBy = this.loggeduser.id;
    this.regAcceptData = {
      id: 0, //this.member.memberRegistrations,
      memberId: this.member!.id,
      acceptedBy: this.loggeduser.id,
      acceptedDate: Utils.today,
      schemeType: '',
      year: 0,
    };
    Swal.fire({
      title: 'Accept Registration',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const ret = await this.auth.updateMember(
            'memberAccept',
            this.regAcceptData
          ); // Convert Observable to Promise

          if (ret >= 1) {
            this.loadMemberPage(''); // Reload the member page or data
            return 'Accepted'; // Show success message
          } else {
            throw new Error('Not Updated, Try again'); // If no rows affected, show error
          }
        } catch (error) {
          throw new Error(
            'An error occurred while accepting the registration.'
          ); // Show error message in case of failure
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log('result value ' + result);
      if (result.isConfirmed) {
        Swal.fire('Success', result.value, 'success'); // Success message
      } else {
        Swal.fire('Error', result.value, 'error'); // Error message if operation fails
      }
    });
  }
}
