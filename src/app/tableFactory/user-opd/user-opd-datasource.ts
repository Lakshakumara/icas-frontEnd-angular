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
    /* if (this.paginator && this.sort) {
       // Combine everything that affects the rendered data into one update
       // stream for the data-table to consume.
       return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
         .pipe(map(() => {
           return this.getPagedData(this.getSortedData([...this.data ]));
         }));
     } else {
       throw Error('Please set the paginator and sort on the data source before connecting.');
     }*/

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
      .subscribe((claims: any) => this.claimSubject.next(claims));
    console.log('fetch data set ', this.claimSubject);
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  /* private getPagedData(data: ClaimOPD[]): ClaimOPD[] {
     if (this.paginator) {
       const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
       return data.splice(startIndex, this.paginator.pageSize);
     } else {
       return data;
     }
   }*/

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  /*private getSortedData(data: ClaimOPD[]): ClaimOPD[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }*/
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
/*function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
*/
