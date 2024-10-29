import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, Observable } from "rxjs";

export class MyTableDataSource extends DataSource<any> {
    data: any[] | undefined;
    paginator: MatPaginator | undefined;
    sort: MatSort | undefined;

    private dataSetSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

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
}