import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Dependant } from 'src/app/Model/dependant';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { Utils } from 'src/app/util/utils';

@Component({
  selector: 'app-dependant',
  templateUrl: './dependant.component.html',
  styleUrls: ['./dependant.component.css'],
})
export class DependantComponent implements OnInit {
  today = Utils.today;
  inputdata: any;
  editdata: Dependant[];
  relationshipOptions: string[] = Constants.relationShip;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<DependantComponent>,
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
    dob: this.buildr.control(null, Validators.required),
    relationship: this.buildr.control('', Validators.required),
  });

  ngOnInit() {
    this.editdata.forEach((d) => {
      this.dForm.patchValue({
        id: d.id,
        name: d.name,
        nic: d.nic,
        dob: d.dob,
        relationship: d.relationship,
      });
    });
  }

  addDependentDetails() {
    if (this.dForm.invalid) return;
    this.authService.getDependant(this.dForm.value.name).subscribe({
      next: (dep) => {
        if (dep.name == null) {
          this.ref.close(this.dForm);
        } else {
          console.log('exists dep' + JSON.stringify(dep));
          dep.relationship = this.dForm.value.relationship;
          this.dForm.patchValue({
            id: dep.id,
            name: dep.name,
            nic: dep.nic,
            dob: dep.dob,
          });
          this.ref.close(this.dForm);
        }
      },
      error: (error) => {
        console.log('Error  dep search like ' + error);
      },
    });
  }

  closePopup() {
    this.ref.close(this.dForm);
  }
}
