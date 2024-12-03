import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';

export class ClaimDataSource extends DataSource<any> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  private dataSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public totalCount = 0;
  public data:any;

  constructor(private auth: AuthServiceService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.dataSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  requestData(
    claimStatus: string,
    filter = '',
    sortDirection = 'asc',
    pageIndex = 0,
    pageSize = 10
  ) {
    this.loadingSubject.next(true);
    //console.log(this.sort!.direction, this.paginator!.pageIndex,this.paginator!.pageSize,this.sort!.active)
    this.auth
      .getAllClaims(
        '',
        0,
        '',
        claimStatus,
        filter,
        this.sort!.direction,
        this.paginator!.pageIndex,
        this.paginator!.pageSize,
        this.sort!.active
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((receiveData: any) => {
        this.dataSubject.next(receiveData.content);
        this.totalCount = receiveData.totalElements;
      });
  }

  getClaimData(
    claimId: number
  ) {
    this.loadingSubject.next(true);
    this.auth
      .getClaimData(claimId
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((receiveData: any) => {
        this.data = receiveData.content
        this.dataSubject.next(receiveData.content);
        this.totalCount = receiveData.totalElements;
      });
  }
}
