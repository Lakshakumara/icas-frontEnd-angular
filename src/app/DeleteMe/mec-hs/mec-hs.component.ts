import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Claim } from 'src/app/Model/claim';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MEC_Column_Accept } from 'src/app/Model/claim';
import { Member } from 'src/app/Model/member';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';

@Component({
  selector: 'app-mec-hs',
  templateUrl: './mec-hs.component.html',
  styleUrls: ['./mec-hs.component.css'],
})
export class MecHsComponent implements OnInit {
  mySelection!: any;
  selectedClaim!: Claim;
  claimHistory!: Claim[];
  claimCategories = Constants.claimCategory;
  dataSource!: LoadDataSource;
  displayedColumn: string[] = MEC_Column_Accept.map((col) => col.key);
  columnsSchema: any = MEC_Column_Accept;

  selectedMember!: Member;
  search: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private auth: AuthServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataSource = new LoadDataSource(this.auth);
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadClaimPage()))
      .subscribe();
  }

  get onlySelectedClaims(): Claim {
    return this.selectedClaim;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const val = filterValue.trim().toLowerCase();
    console.log(val);
  }

  loadClaimPage() {
    this.dataSource.loadClaims(
      Constants.CATEGORY_SHE,
      Constants.CLAIMSTATUS_MEDICAL_DECISION_PENDING
    );
  }
  onRowClicked(claim: Claim) {
    console.log('claim ', claim);
    this.selectedMember = claim.member;
    this.selectedClaim = claim;
  }
  acceptClaim() {
    /* this.selectedClaim.acceptedDate = new Date();
    this.selectedClaim.claimStatus = "accepted";
    this.auth.saveOPD(this.selectedClaim).subscribe(d => {
      this.loadClaimPage();
      Swal.fire(
        'Updated',
        `Reference number ${d}`,
        'success'
      );
      this.selectedMember.pop;
    });*/
  }
}
