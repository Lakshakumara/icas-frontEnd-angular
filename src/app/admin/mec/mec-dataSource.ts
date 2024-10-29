import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Claim } from 'src/app/Model/claim';

export class MECDataSource extends DataSource<Claim> {
    //data: Claim[] | undefined;
    paginator: MatPaginator | undefined;
    sort: MatSort | undefined;
    filter: string ="";

    private claimSubject = new BehaviorSubject<Claim[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

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
/*
    requestData(claimType:string, claimStatus: string,
        filter= this.filter, sortDirection = 'asc', pageIndex = this.paginator?.pageIndex, pageSize = this.paginator?.pageSize) {

        this.loadingSubject.next(true);
        this.auth.getAllClaims(claimType, 0, '', claimStatus, filter, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((receiveData: any) => this.claimSubject.next(receiveData));
        console.log("fetch data set ", this.claimSubject)
    }
    
    async loadCurrentClaimData(claimId: number) {
        this.loadingSubject.next(true);
        let currentClaimData: any[] = [];
        return this.auth.getClaim(claimId)
          .then((claim) => {
            let x = <any><unknown>claim;
            x.claimData.forEach((d:any) => {
              let status: string;
              if (d.rejectedDate != null) status = " Rejected - " + d.rejectRemarks;
              else if (d.deductionAmount != null) status = " Deducted - Rs. " + d.deductionAmount;
              else status = (d.remarks == null)?"Approved ":"Approved - "+d.remarks;
    
              currentClaimData.push({
                title: d.scheme.title + "-" + d.scheme.idText,
                status: status,
              });
            });
    
            return currentClaimData;
          });
      }*/
}