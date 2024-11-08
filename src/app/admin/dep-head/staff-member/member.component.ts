import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Member, Member_Column_Accept } from 'src/app/Model/member';
import { MemberDataSource } from './members-dataSource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';

import { merge, tap } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { Utils } from 'src/app/util/utils';
import Swal from 'sweetalert2';
import { Registration } from 'src/app/Model/registration';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent implements OnInit, AfterViewInit {
  loggeduser: any;
  member!: Member;
  columnsSchema: any = Member_Column_Accept;
  displayedColumn: string[] = Member_Column_Accept.map((col) => col.key);
  regAcceptData!: Registration;
  regAccept: boolean = false;
  dataSource!: MemberDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private auth: AuthServiceService,
    private share: SharedService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggeduser = this.share.getUser();
    if (this.loggeduser == null) this.router.navigate(['/signin']);
    console.log(this.displayedColumn)
    console.log(this.columnsSchema)
    this.dataSource = new MemberDataSource(this.auth);
    this.dataSource.loadMember('notAccept');
  }

  ngAfterViewInit() {
    // server-side search
    /*fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadMemberPage();
        })
      )
      .subscribe();*/

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadMemberPage()))
      .subscribe();
  }
  loadMemberPage() {
    this.member = <Member>{};
    this.regAccept = false;
    this.dataSource.loadMember('notAccept'); // this.input.nativeElement.value
  }
  onRowClicked(member: Member) {
    this.member = member;
  }
  acceptRegistration() {
    this.member.currentRegistration.acceptedDate = new Date();
    this.member.currentRegistration.acceptedBy = this.loggeduser.id;
    this.regAcceptData = {
      id: 0, //this.member.memberRegistrations,
      memberId: this.member.id,
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
        const ret = this.auth
          .update('memberAccept', this.regAcceptData)
          .subscribe((a) => {
            console.log('a ', a);
            if (a >= 1) {
              this.loadMemberPage();
              return Swal.showValidationMessage('Accepted');
            } else return Swal.showValidationMessage(' Not Updated Try againg');
          });

        return ret;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Accepting', '', 'success');
      }
      this.loadMemberPage();
    });
  }
}
