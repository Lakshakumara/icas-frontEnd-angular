import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Claim } from 'src/app/Model/claim';

export class ClaimDataSource extends DataSource<Claim> {
    data: Claim[] | undefined;
    paginator: MatPaginator | undefined;
    sort: MatSort | undefined;
    

    private claimSubject = new BehaviorSubject<Claim[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public totalCount = 0;

    constructor(private auth: AuthServiceService) { super(); }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    connect(collectionViewer: CollectionViewer): Observable<Claim[]> {
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

    requestData(claimStatus: string,filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {
        this.loadingSubject.next(true);
        this.auth.getAllClaims('%', 0, '',claimStatus, filter, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((receiveData: any) => {
                this.claimSubject.next(receiveData.content);
                this.totalCount = receiveData.totalElements
            });
    
    }

/**
 * 
 * @param claimType 
 * @param year 
 * @param empNo  '' for search all
 * @param claimStatus 
 * @param filter 
 * @param sortDirection 
 * @param pageIndex 
 * @param pageSize 
 */
  /*  requestAllData(claimType: string = "%", year: number = 0, empNo: string ="%", claimStatus: string = "%",
        filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {

        this.loadingSubject.next(true);

        this.auth.getAllClaims(claimType, year, empNo,claimStatus, filter, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((receiveData: any) => this.claimSubject.next(receiveData));
        console.log("fetch data set ", this.claimSubject)
    }*/
}