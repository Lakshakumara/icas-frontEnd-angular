import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Claim } from 'src/app/Model/claim';

export class VoucherDataSource extends DataSource<Claim> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  private dataSetSubject = new BehaviorSubject<Claim[]>([]);
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
  connect(collectionViewer: CollectionViewer): Observable<Claim[]> {
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

  /*requestData(claimStatus: string,
        filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {
            console.log("send in voucher");
        this.loadingSubject.next(true);

        this.auth.getAllClaims('%', 0, '', claimStatus, filter, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((receiveData: any) => this.dataSetSubject.next(receiveData));
        console.log("fetch data set ", this.dataSetSubject)
    }*/
  /**
   *
   * @param claimStatus  String pattern
   * @param filter  '' to ignor
   * @param sortDirection  default asc
   * @param pageIndex  default 0
   * @param pageSize default 10
   * @returns
   */
  requestAllData(
    claimStatus: string,
    filter = '',
    sortDirection = 'asc',
    pageIndex = 0,
    pageSize = 10) {
    this.loadingSubject.next(true);
    return this.auth.getAllClaims(
      '%',
      0,
      '',
      claimStatus,
      filter,
      sortDirection,
      pageIndex,
      pageSize);
  }
}
