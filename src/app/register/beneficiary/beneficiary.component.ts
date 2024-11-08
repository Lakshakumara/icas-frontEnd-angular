import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Beneficiary } from 'src/app/Model/benificiary';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { Utils } from 'src/app/util/utils';

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css'],
})
export class BeneficiaryComponent implements OnInit {
  today = Utils.today;
  inputdata: any;
  editdata: Beneficiary[];
  relationshipOptions: string[] = Constants.relationShip;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<BeneficiaryComponent>,
    private buildr: FormBuilder,
    private authService: AuthServiceService
  ) {
    this.inputdata = data;
    this.editdata = data.dataSet;
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
    this.editdata.forEach((d) => {
      this.dForm.patchValue({
        id: d.id,
        name: d.name,
        nic: d.nic,
        relationship: d.relationship,
        percent: d.percent,
      });
    });
  }

  addBeneficiaryDetails() {
    //if (this.dForm.value.percent) return;
    console.log('addBeneficiaryDetails');
    this.authService.getDependant(this.dForm.value.name).subscribe({
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
    });
  }

  closePopup() {
    this.ref.close(this.dForm);
  }
}
