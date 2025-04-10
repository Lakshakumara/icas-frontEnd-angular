import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatOption, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { Utils } from 'src/app/util/utils';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor,
    MatAutocompleteModule, MatOption, MatCardModule, MatFormField, MatIcon, MatLabel,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css'],
})
export class BeneficiaryComponent implements OnInit {
  today = Utils.today;
  inputData: any;
  //editdata: Beneficiary[];
  relationshipOptions: string[] = Constants.relationShip;
  showEditBtn:boolean=false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<BeneficiaryComponent>,
    private buildr: FormBuilder,
    private authService: AuthServiceService
  ) {
    this.inputData = data;
    //this.editdata = data.dataSet;
  }

  dForm = this.buildr.group({
    id: this.buildr.control(null),
    name: this.buildr.control('', Validators.required),
    nic: this.buildr.control(''),
    relationship: this.buildr.control('', Validators.required),
    percent: this.buildr.control(null, [
      Validators.required,
      Validators.max(100),
    ]),
  });

  ngOnInit() {
    this.inputData.dataSet.forEach((d:any) => {
      this.dForm.patchValue({
        id: d.id,
        name: d.name,
        nic: d.nic,
        relationship: d.relationship,
        percent: d.percent,
      });
      this.showEditBtn = true
    });
  }
  addBeneficiaryDetails() {
    //if (this.dForm.value.percent) return;
    console.log('addBeneficiaryDetails');
    const ben:any = this.authService.getMemberBeneficiaries(this.inputData.empNo, 0, this.dForm.value.name)
    if (ben.name == null) {
      this.ref.close(this.dForm);
    } else {
      console.log('exists beneficiary' + JSON.stringify(ben));
      //ben.relationship = this.dForm.value.relationship;
      this.dForm.patchValue({
        id: ben.id,
        name: ben.name,
        nic: ben.nic,
      });
      this.ref.close(this.dForm);
    }

    /*.subscribe({
      next: (dep) => {
        if (dep.name == null) {
          this.ref.close(this.dForm);
        } else {
          console.log('exists beneficiary' + JSON.stringify(dep));
          dep.relationship = this.dForm.value.relationship;
          this.dForm.patchValue({
            id: dep.id,
            name: dep.name,
            nic: dep.nic,
          });
          this.ref.close(this.dForm);
        }
      },
      error: (error) => {
        console.log('Error  beneficiary search like ' + error);
      },
    });*/
  }

  closePopup() {
    this.ref.close(this.dForm);
  }
}
