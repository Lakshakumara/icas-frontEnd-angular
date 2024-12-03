import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, catchError, finalize } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Claim } from 'src/app/Model/claim';

export class VoucherDataSource extends DataSource<Claim> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  public totalCount = 0;
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

  get data() {
    return this.dataSetSubject.getValue;
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
  }
