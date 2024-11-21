import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Claim, MEC_Column_Accept } from 'src/app/Model/claim';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, merge, startWith, tap } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { SchemeTitles } from 'src/app/Model/scheme';
import { SchemeService } from 'src/app/service/scheme.service';
import { Constants } from 'src/app/util/constants';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';
import { MatTooltip } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-mec',
  templateUrl: './mec.component.html',
  styleUrls: ['./mec.component.css'],
})
export class MecComponent implements OnInit {
  title!: string;

  claim_category!: string;
  panelOpenState = false;
  claim!: Claim;
  selectedClaim!: Claim | null;
  claimDataStatus!: string;

  currentClaimData: any[] = [];
  dataSource!: LoadDataSource;
  displayedColumn: string[] = MEC_Column_Accept.map((col) => col.key);
  columnsSchema: any[] = MEC_Column_Accept;

  selectedclaimTitle!: any;
  search: any;
  chrejected: any;
  tobeUpdated!: any[];

  columnDefinition = [
    {
      name: 'title',
      displayName: 'Title',
      disableSorting: true,
    },
    {
      name: 'status',
      displayName: 'Status',
      disableSorting: true,
    },
  ];
  // @ViewChild("myTooltip") myTooltip!: MatTooltip
  totalLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private schemeService: SchemeService,
    private auth: AuthServiceService,
    private route: ActivatedRoute
  ) {}

  stateGroups!: SchemeTitles[];
  stateGroupOptions!: Observable<SchemeTitles[]>;

  formGroup = this.fb.group({
    stateGroup: this.fb.control('', [Validators.required]),
    deductionAmount: this.fb.control(
      { value: <number>{}, disabled: true },
      Validators.required
    ),
    deductionremarks: this.fb.control(
      { value: '', disabled: true },
      Validators.required
    ),
    mecremarks: this.fb.control(''),
    mecreturndate: this.fb.control(new Date()),
    rejectedDate: this.fb.control(new Date()),
    rejectremarks: this.fb.control(
      { value: '', disabled: true },
      Validators.required
    ),
    remarks: this.fb.control(''),
  });

  onRadioButtonChange(event: any) {
    if (event.value == undefined) return;
    console.log(event.value);
    this.formGroup.controls.deductionAmount.disable();
    this.formGroup.controls.deductionremarks.disable();
    this.formGroup.controls.rejectremarks.disable();
    switch (event.value) {
      case 'Rejected':
        this.claimDataStatus = 'Rejected';
        this.formGroup.controls.rejectremarks.enable();
        break;
      case 'Deducted':
        this.claimDataStatus = 'Deducted';
        this.formGroup.controls.deductionAmount.enable();
        this.formGroup.controls.deductionremarks.enable();
        break;
      case 'Approved':
        this.claimDataStatus = 'Approved';
        break;
    }
  }

  disableField(checked: any) {
    if (!checked) {
      this.formGroup.controls.rejectremarks.disable();
    } else {
      this.formGroup.controls.rejectremarks.enable();
    }
  }

  ngOnInit() {
    this.route.data.subscribe((v: any) => {
      this.title =
        v.param == Constants.CATEGORY_OPD
          ? 'OPD Claim Evaluation'
          : 'Medical Evaluation Committee';
      this.claim_category = v.param;
    });

    this.dataSource = new LoadDataSource(this.auth);
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    this.loadClaimPage();
    this.schemeService
      .getSchemeTitle(this.claim_category)
      .subscribe((titles: any) => {
        this.stateGroups = titles;
      });

    this.stateGroupOptions = this.formGroup
      .get('stateGroup')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterGroup(value || ''))
      );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadClaimPage()))
      .subscribe();
    this.dataSource.loading$.subscribe((loading) => {
      if (!loading) {
        this.totalLength = this.dataSource.totalCount;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadClaimPage() {
    this.selectedClaim = null;
    this.dataSource.requestData(
      this.claim_category,
      Constants.CLAIMSTATUS_MEDICAL_DECISION_PENDING
    );
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onRowClicked(claim: Claim) {
    this.selectedClaim = claim;
    this.loadTitleTable();
    this.loadMedicalHistory();
  }
  onNotifySelected(selectedclaimTitle: any[]) {
    this.selectedclaimTitle = selectedclaimTitle[0];
  }

  loadTitleTable() {
    this.dataSource.loadCurrentClaimData(this.selectedClaim!.id).then((res) => {
      this.currentClaimData = res;
      console.log(
        'this.currentClaimData: ' + JSON.stringify(this.currentClaimData)
      );
    });
  }
  loadMedicalHistory() {}

  updateClaim() {
    if (this.currentClaimData.length == 0) {
      Constants.Toast.fire('Please add Title details');
      return;
    }
    this.tobeUpdated = [];

    this.tobeUpdated.push({
      criteria: Constants.CLAIMSTATUS_MEDICAL_DECISION_APPROVED,
      id: this.selectedClaim!.id,
      claimStatus: Constants.CLAIMSTATUS_MEDICAL_DECISION_APPROVED,
      //idText: scheme[1],
      requestAmount: this.selectedClaim!.requestAmount,
      //deductionAmount: this.formGroup.value.deductionAmount,
      mecremarks: this.formGroup.value.mecremarks,
      mecreturndate: this.formGroup.value.mecreturndate,
      /* rejecteddate:
         this.formGroup.value.rejectremarks == undefined
           ? undefined
           : new Date(),
       rejectremarks: this.formGroup.value.rejectremarks,*/
      remarks: this.formGroup.value.remarks,
    });

    console.log(this.tobeUpdated);
    Swal.fire({
      title: 'Complete the medical approval',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Complete',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        return await this.auth.updateClaim_new(this.tobeUpdated);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Updated', '', 'success');
          this.loadClaimPage();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }

  addClaimTitle() {
    let scheme = this.formGroup.value.stateGroup?.split('-');
    if (scheme == undefined) return;

    /**
     * catch error scheme
     */
    this.tobeUpdated = [];

    this.tobeUpdated.push({
      criteria: 'claimdata',
      id: this.selectedClaim!.id,
      idText: scheme[1],
      claimDataStatus: this.claimDataStatus,
      requestAmount: this.selectedClaim!.requestAmount,
      rejectDate: this.claimDataStatus == 'Rejected' ? new Date() : undefined,
      rejectRemarks: this.formGroup.value.rejectremarks,

      deductionAmount: this.formGroup.value.deductionAmount,
      deductionRemarks: this.formGroup.value.deductionremarks,

      // mecremarks: this.formGroup.value.mecremarks,
      mecReturnDate: this.formGroup.value.mecreturndate,

      remarks: this.formGroup.value.remarks,
    });

    console.log(this.tobeUpdated);
    Swal.fire({
      title: 'Add Claim Data',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ADD',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await this.auth.updateClaim_new(this.tobeUpdated);
        /*ret.subscribe((a)=>{
          if (a >= 1) {
          return Swal.showValidationMessage('Updated');
        } else return Swal.showValidationMessage('Not Updated Try againg');
        })*/
        //return ret;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Updated', '', 'success');
          this.formGroup.reset();
          this.loadTitleTable();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
  }
  removeClaimTitle() {
    if (this.selectedclaimTitle.id < 1) return;
    Swal.fire({
      title: 'Are You Sure to delete',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        let x = await this.auth.deleteClaimData(this.selectedclaimTitle.id);
        return x;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log('result ', result.value);
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Data has been deleted.',
          icon: 'success',
        }).then((_result) => {
          this.loadTitleTable();
        });
        //
      } else {
        console.log('error');
      }
    });

    console.log('selected id ', this.selectedclaimTitle.id);
  }
  private _filterGroup(value: string): SchemeTitles[] {
    if (value) {
      return this.stateGroups
        .map((group) => ({
          id: group.id,
          idText: _filter(group.idText, value),
          description: group.description,
        }))
        .filter((group) => group.idText.length > 0);
    }
    return this.stateGroups;
  }

  click() {
    console.log('selected', this.formGroup.value);
  }
  onValueChange(evt: any) {
    var target = evt.target;
    /*if (target.checked) {
      doSelected(target);
      this._prevSelected = target;
    } else {
      doUnSelected(this._prevSelected)
    }*/
  }
  showMember() {
    Swal.fire('Member', '', 'info');
  }
}
