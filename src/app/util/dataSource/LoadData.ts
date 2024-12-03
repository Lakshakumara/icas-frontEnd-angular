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

  requestData(
    claimType: string,
    claimStatus: string,
    filter = this.filter,
    sortDirection = 'asc',
    pageIndex = this.paginator?.pageIndex,
    pageSize = this.paginator?.pageSize,
    empNo = ''
  ) {
    this.loadingSubject.next(true);
    this.auth
      .getAllClaims(
        claimType,
        0,
        empNo,
        claimStatus,
        filter,
        sortDirection,
        pageIndex,
        pageSize
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((receiveData: any) => {
        this.dataSetSubject.next(receiveData.content);
        this.totalCount = receiveData.totalElements;
      });
  }
  requestAllData(
    claimStatus: string,
    filter = '',
    sortDirection = 'asc',
    pageIndex = 0,
    pageSize = 10
  ) {
    this.loadingSubject.next(true);
    return this.auth.getAllClaims(
      '',
      0,
      '',
      claimStatus,
      filter,
      sortDirection,
      pageIndex,
      pageSize
    );
  }
  async loadCurrentClaimData(claimId: number) {
    console.log('claimId ', claimId);
    this.loadingSubject.next(true);
    let currentClaimData: any[] = [];
    return this.auth.getClaim(claimId).then((claim) => {
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
    
  /*filterData(
    claimType: string,
    year = 0,
    empNo: string = '',
    claimStatus: string,
    filter = this.filter,
    sortDirection = 'asc',
    pageIndex = this.paginator?.pageIndex,
    pageSize = this.paginator?.pageSize
  ) {
    this.loadingSubject.next(true);
    return this.auth.getAllClaims(
      claimType,
      year,
      empNo,
      claimStatus,
      filter,
      sortDirection,
      pageIndex,
      pageSize
    );
  }*/
}
