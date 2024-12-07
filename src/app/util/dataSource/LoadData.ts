import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, catchError, finalize } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';

export class LoadDataSource extends DataSource<any> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  filter: string = '';
  public totalCount = 0;
  private dataSetSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  data: any
  constructor(private auth: AuthServiceService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.dataSetSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSetSubject.complete();
    this.loadingSubject.complete();
  }

  loadClaims(
    claimType: string,
    claimStatus: string,
    filter = this.filter,
    empNo = '',
    year:number = 0,
    sortDirection = (this.sort?.direction)?this.sort.direction:'asc',
    sortField = (this.sort?.active)?this.sort.active:'',
    pageIndex = this.paginator?.pageIndex,
    pageSize = this.paginator?.pageSize,
  ) {
    this.loadingSubject.next(true);
    this.auth
      .getAllClaims(
        claimType,
        year,
        empNo,
        claimStatus,
        filter,
        sortDirection,
        pageIndex,
        pageSize,
        sortField
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((receiveData: any) => {
        console.log("receiveData to datasource ",receiveData)
        this.data = receiveData.content
        this.dataSetSubject.next(this.data);
        this.totalCount = receiveData.totalElements;
      });
  }

  getClaimData(claimId: number) {
    this.loadingSubject.next(true);
    this.auth.getClaimData(claimId)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((receiveData: any) => {
        this.data = receiveData.content
        this.dataSetSubject.next(receiveData.content);
        this.totalCount = receiveData.totalElements;
      });
  }

  async loadCurrentClaimData(claimId: number) {
    this.loadingSubject.next(true);
    let currentClaimData: any[] = [];
    return this.auth.getClaim(claimId)
      .then((claim) => {
        let x = <any>(<unknown>claim);
        x.claimData.forEach((d: any) => {
          console.log('d ', d);
          let status: string;
          console.log('claimDataStatus ', d.claimDataStatus);
          if (d.claimDataStatus == 'Rejected')
            status = 'Rejected - ' + d.rejectRemarks;
          else if (d.claimDataStatus == 'Deducted')
            status = 'Deducted - Rs. ' + d.deductionAmount;
          else if (d.claimDataStatus == 'Approved')
            status = d.remarks == null ? 'Approved ' : 'Approved - ' + d.remarks;
          else status = 'Other';
          if (d.scheme != null)
            currentClaimData.push({
              id: d.id,
              title: d.scheme.title + '-' + d.scheme.idText,
              status: status,
            });
        });

        return currentClaimData;
      });
  }

  loadMember(searchFor: string, searchText: any, filter = '',
    pageIndex = this.paginator?.pageIndex, pageSize = this.paginator?.pageSize,
    sortDirection = this.sort?.direction, sortField = this.sort?.active) {

    this.loadingSubject.next(true);
    this.auth.getMembers(searchFor, searchText, filter, sortDirection, pageIndex, pageSize, sortField)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((member: any) => {
        if (member && member.content) {
          this.data = member.content
          this.dataSetSubject.next(this.data);
          this.totalCount = member.totalElements;
        } else {
          this.data = []
          this.dataSetSubject.next(this.data); // Set to empty array if member or member.content is null
          this.totalCount = 0; // Set totalCount to 0 if there's an error
        }
      });
    console.log("fetch data set ", this.dataSetSubject)
  }

  /*requestAllData(
    claimStatus: string
  ) {
    this.loadingSubject.next(true);
    return this.auth.getAllClaims(
      '',
      0,
      '',
      claimStatus
    );
  }*/
}
