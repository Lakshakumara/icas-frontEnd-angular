import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { Claim } from 'src/app/Model/claim';
import { Member, Member_Column_Accept } from 'src/app/Model/member';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { MemberDataSource } from 'src/app/util/dataSource/members-dataSource';

@Component({
  selector: 'app-member-data',
  templateUrl: './member-data.component.html',
  styleUrls: ['./member-data.component.css'],
})
export class MemberDataComponent implements OnInit, AfterViewInit {
  @Output() getMember = new EventEmitter();
  selectedMember!: Member | null;
  dataSource!: MemberDataSource;
  totalLength = 0;
  searchControl: FormControl = new FormControl();
  displayedColumn: string[] = Member_Column_Accept.map((col) => col.key);
  columnsSchema: any = Member_Column_Accept;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthServiceService,
    private buildr: FormBuilder
  ) {}

  ngOnInit() {
    this.dataSource = new MemberDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.setupTableFeatures();
  }
  setupTableFeatures() {
    this.changeDetectorRef.detectChanges();
    this.sort.direction = 'asc'
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
       
        this.loadMemberPage(filterValue, "empNo");
      });
  }
  loadMemberPage(filter: string, sortField:string = "name") {
    this.dataSource.loadMember(
      Constants.ALL,
      null,
      filter,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      sortField
    );
  }
  onRowClicked(selectedMember: Member) {
    this.getMember.emit(selectedMember);
  }
}
