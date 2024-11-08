import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Router } from '@angular/router';
import { merge, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Claim, Claim_Head_Accept } from 'src/app/Model/claim';
import { ClaimDataSource } from './claim-dataSource';
import { SharedService } from 'src/app/shared/shared.service';
import { Constants } from 'src/app/util/constants';

@Component({
  selector: 'app-claim-update',
  templateUrl: './claim-update.component.html',
  styleUrls: ['./claim-update.component.css']
})
export class ClaimUpdateComponent implements OnInit {
  loggeduser: any;
  claim !: Claim;
  selectedClaim!: Claim | null;

  dataSource!: ClaimDataSource;
  displayedColumn: string[] = Claim_Head_Accept.map((col) => col.key);
  columnsSchema: any = Claim_Head_Accept;

  search: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private auth: AuthServiceService,
    private share: SharedService,
    private router: Router) { }

  ngOnInit() {
    this.loggeduser = this.share.getUser();
    if (this.loggeduser == null) this.router.navigate(['/signin']);
    this.dataSource = new ClaimDataSource(this.auth);
    this.dataSource.requestData(Constants.CLAIMSTATUS_PENDING);
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadClaimPage())
      )
      .subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const val = filterValue.trim().toLowerCase();
  }

  loadClaimPage() {

    this.selectedClaim = null;
    this.dataSource.requestData(Constants.CLAIMSTATUS_PENDING);
    console.log("Claim Loaded")
  }
  onRowClicked(claim: Claim) {
    this.selectedClaim = claim;
  }

  acceptClaim() {
    if(this.selectedClaim == null) return
    let tobeUpdated: any = [];
    tobeUpdated.push({
      criteria: "headaccept",
      id: this.selectedClaim.id,
      claimStatus: Constants.CLAIMSTATUS_HEAD_APPROVED,
      acceptedBy: this.loggeduser.id,
    });

    Swal.fire({
      title: 'Accept claim',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await this.auth.updateClaim_new(tobeUpdated)
       /* .subscribe((a) => {
          if (a >= 1) {
            return Swal.showValidationMessage('Accepted');
          }
          else return Swal.showValidationMessage(' Not Updated Try againg');
        });
        return ret;*/
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Accepted', '', 'success');
          this.loadClaimPage();
        } else Swal.fire('Error', "Failed to Accept", 'error');
      }
    });
  }
}
