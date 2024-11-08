import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Member } from 'src/app/Model/member';

export class MemberDataSource extends DataSource<Member> {
    data: Member[] | undefined;
    paginator: MatPaginator | undefined;
    sort: MatSort | undefined;

    private dataSetSubject = new BehaviorSubject<Member[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    constructor(private auth: AuthServiceService) { super(); }

    /**
     * Connect this data source to the table. The table will only update when
     * the returned stream emits new items.
     * @returns A stream of the items to be rendered.
     */
    connect(collectionViewer: CollectionViewer): Observable<Member[]> {
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


    loadMember(searchFor: string,
        filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {
        this.loadingSubject.next(true);
        this.auth.getMembers(searchFor, '',filter, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((member: any) => this.dataSetSubject.next(member));
        console.log("fetch data set ", this.dataSetSubject)
    }
}