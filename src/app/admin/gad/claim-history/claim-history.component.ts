import {
  animate,
  animation,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, tap } from 'rxjs';
import { Claim, Claim_All } from 'src/app/Model/claim';
import { ClaimData } from 'src/app/Model/claimData';
import { Member } from 'src/app/Model/member';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';

@Component({
  selector: 'app-claim-history',
  templateUrl: './claim-history.component.html',
  styleUrls: ['./claim-history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ClaimHistoryComponent implements OnInit, AfterViewInit {
  @Input() member: any;
  claims: Claim[] | undefined;
  selectedClaim!: Claim | null;
  expandedElement: any | null;

  claimData!: ClaimData[] | null;
  dataSource!: LoadDataSource;
  displayedColumn: string[] = Claim_All.map((col) => col.key);
  columnsSchema: any = Claim_All;
  totalLength = 0; // Add a total length variable to manage pagination
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  constructor(
    private auth: AuthServiceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.dataSource = new LoadDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.loadClaimPage();
    this.dataSource.loading$.subscribe((loading) => {
      if (!loading) {
        this.totalLength = this.dataSource.totalCount;
      }
    });

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadClaimPage()))
      .subscribe();
  }

  loadClaimPage() {
    console.log(this.member.empNo);
    this.dataSource.requestData(
      '',
      '',
      '',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.member.empNo
    );
  }

  updateDisplayedColumns(selectedColumns: string[]): void {
    this.displayedColumn = selectedColumns;
    this.changeDetectorRef.detectChanges();
  }

  onColumnSelectionChange(columnKey: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.displayedColumn.includes(columnKey)) {
        this.displayedColumn.push(columnKey);
      }
    } else {
      const index = this.displayedColumn.indexOf(columnKey);
      if (index >= 0) {
        this.displayedColumn.splice(index, 1);
      }
    }
    this.updateDisplayedColumns([...this.displayedColumn]);
    this.menuTrigger.openMenu(); // Re-open the menu to keep it open
  }
  onMenuClosed(): void {
    // Logic to handle actions when the menu is closed, if necessary
  }
  onRowClicked(claim: Claim) {
    console.log(claim.id);
    this.expandedElement = this.expandedElement === claim.claimData ? null : claim.claimData;
    this.loadClaimData(claim);
  }
  loadClaimData(claim: Claim) {
    this.selectedClaim = claim;
    console.log(claim);
    this.claimData =
      this.claimData === claim.claimData ? null : claim.claimData;
  }
}
