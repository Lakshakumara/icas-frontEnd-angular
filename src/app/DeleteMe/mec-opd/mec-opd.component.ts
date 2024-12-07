import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Claim, MEC_Column_Accept } from 'src/app/Model/claim';
import Swal from 'sweetalert2';
import { Member } from 'src/app/Model/member';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Observable, filter, map, merge, startWith, tap } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SchemeTitles } from 'src/app/Model/scheme';
import { SchemeService } from 'src/app/service/scheme.service';
import { LoadDataSource } from 'src/app/util/dataSource/LoadData';
import { Constants } from 'src/app/util/constants';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

@Component({
  selector: 'app-mec-opdx',
  templateUrl: './mec-opd.component.html',
  styleUrls: ['./mec-opd.component.css'],
})
export class MecOpdComponent implements OnInit {
  panelOpenState = false;
  claim!: Claim;
  selectedClaim!: Claim | null;
  selectedMember!: Member[];

  dataSource!: LoadDataSource;
  displayedColumn: string[] = MEC_Column_Accept.map((col) => col.key);
  columnsSchema: any = MEC_Column_Accept;

  search: any;
  chrejected: any;
  tobeUpdated!: any[];

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
    stateGroup: new FormControl('', [Validators.required]),
    deductionAmount: new FormControl(''),
    mecremarks: new FormControl('', [Validators.required]),
    mecreturndate: new FormControl(''),
    rejected: new FormControl(false),
    rejecteddate: new FormControl(''),
    rejectremarks: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    remarks: new FormControl(''),
  });
  disableField(checked: any) {
    if (!checked) {
      this.formGroup.controls.rejectremarks.disable();
    } else {
      this.formGroup.controls.rejectremarks.enable();
    }
  }
  ngOnInit() {
    this.claim = this.route.snapshot.data['claim'];
    this.dataSource = new LoadDataSource(this.auth);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.loadClaims(
      Constants.CATEGORY_OPD,
      Constants.CLAIMSTATUS_MEDICAL_DECISION_PENDING
    );

    this.schemeService.getSchemeTitle('opd').subscribe((titles: any) => {
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadClaimPage() {
    this.selectedMember = <Member[]>[{}];
    this.selectedClaim = null; //<Claim>{};
    this.dataSource.loadClaims(
      Constants.CATEGORY_OPD,
      Constants.CLAIMSTATUS_MEDICAL_DECISION_PENDING
    );
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onRowClicked(claim: Claim) {
    this.selectedMember = [claim.member];
    this.selectedClaim = claim;
  }
  loadMedicalHistory() {}

  updateClaim() {
    let scheme = this.formGroup.value.stateGroup?.split('-');
    if (scheme == null) return;

    this.tobeUpdated = [];
    this.tobeUpdated.push({
      criteria: 'opdupdate',
      id: this.selectedClaim!.id,
      claimStatus: Constants.CLAIMSTATUS_MEDICAL_DECISION_APPROVED,
      idText: scheme[1],
      requestAmount: this.selectedClaim!.requestAmount,
      deductionAmount: this.formGroup.value.deductionAmount,
      mecremarks: this.formGroup.value.mecremarks,
      mecreturndate: new Date(),
      rejecteddate: this.formGroup.value.rejected ? new Date() : null,
      rejectremarks: this.formGroup.value.rejected
        ? this.formGroup.value.rejectremarks
        : null,
      remarks: this.formGroup.value.remarks,
    });

    console.log(this.tobeUpdated);
    Swal.fire({
      title: 'Update Details',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await this.auth.updateClaim_new(this.tobeUpdated);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value >= 1) {
          Swal.fire('Claim Updated', '', 'success');
          this.formGroup.reset();
          this.loadClaimPage();
        } else Swal.fire('Error', 'Failed to Update', 'error');
      }
    });
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
}
