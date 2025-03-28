import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { Member, Member_Column_Accept } from 'src/app/Model/member';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';

@Component({
  selector: 'app-member-data',
  templateUrl: './member-data.component.html',
  styleUrls: ['./member-data.component.css'],
})
export class MemberDataComponent implements OnInit, AfterViewInit {
  @Output() getMember = new EventEmitter();
  selectedMember!: Member | null;
  dataSource!: LoadDataSource;
  totalLength = 0;
  searchControl: FormControl = new FormControl();
  displayedColumn: string[] = Member_Column_Accept.map((col) => col.key);
  columnsSchema: any = Member_Column_Accept;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private auth: AuthServiceService
  ) { }

  ngOnInit() {
    this.dataSource = new LoadDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.setupTableFeatures();
  }
  setupTableFeatures() {
    this.dataSource.sort = this.sort
    this.dataSource.paginator = this.paginator
    this.sort.direction = 'asc';
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.changeDetectorRef.detectChanges();
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
        this.sort.active = 'name';
        this.loadMemberPage(filterValue);
      });
    this.loadMemberPage('');
  }
  loadMemberPage(filter: string) {
    console.log('this.sort.direction ', this.sort.direction);
    this.dataSource.loadMember(
      Constants.ALL,
      null,
      filter,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }
  onRowClicked(selectedMember: Member) {
    this.selectedMember = selectedMember
    this.getMember.emit(selectedMember);
  }
}
