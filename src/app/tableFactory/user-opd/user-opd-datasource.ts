import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, map } from 'rxjs/operators';
import {
  Observable,
  of as observableOf,
  merge,
  BehaviorSubject,
  of,
} from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { ClaimOPD } from 'src/app/Model/claimOPD';

// TODO: replace this with real data from your application

/**
 * Data source for the UserOPD view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class UserOPDDataSource extends DataSource<ClaimOPD> {
  data: ClaimOPD[] | undefined;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  public totalCount = 0;
  private claimSubject = new BehaviorSubject<ClaimOPD[]>([]);
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
  connect(collectionViewer: CollectionViewer): Observable<ClaimOPD[]> {
    return this.claimSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.claimSubject.complete();
    this.loadingSubject.complete();
  }

  loadClaims(
    claimType: string,
    year: number,
    empNo: string,
    claimStatus: string,
    filter = '',
    sortDirection = 'asc',
    pageIndex = 0,
    pageSize = 10
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
        pageSize
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((claims: any) => {
        this.claimSubject.next(claims.content)
        this.totalCount = claims.totalElements}
      );
    console.log('fetch data set ', this.claimSubject);
  }

}
