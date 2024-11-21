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
    public totalCount = 0;
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


    loadMember(searchFor: string, searchText:any, filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 10) {
        this.loadingSubject.next(true);
        this.auth.getMembers(searchFor, searchText, filter, sortDirection, pageIndex, pageSize)
            .pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((member: any) => {
                if (member && member.content) {
                    this.dataSetSubject.next(member.content);
                    this.totalCount = member.totalElements;
                } else {
                    this.dataSetSubject.next([]); // Set to empty array if member or member.content is null
                    this.totalCount = 0; // Set totalCount to 0 if there's an error
                }
            });
        console.log("fetch data set ", this.dataSetSubject)
    }
}