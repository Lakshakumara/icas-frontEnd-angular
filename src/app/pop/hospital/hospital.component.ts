import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Dependant } from 'src/app/Model/dependant';
import { Member } from 'src/app/Model/member';
import { Scheme } from 'src/app/Model/scheme';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Constants } from 'src/app/util/constants';
import { Utils } from 'src/app/util/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css'],
})
export class HospitalComponent implements OnInit {
  member!: Member;
  inputdata: any;
  claimers: string[] = ['Member'];
  schemeTitles!: string[];
  today = Utils.today;
  beforeThreeMonth = Utils.threeMonthbeforetoday;
  SCHEME_INDIVIDUAL: string = Constants.SCHEME_INDIVIDUAL;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<HospitalComponent>,
    private buildr: FormBuilder,
    private share: SharedService,
    private router: Router,
    private authService: AuthServiceService
  ) {
    this.inputdata = this.data;
  }
  formGroup = this.buildr.group({
    id: this.buildr.control(''),
    memberId: this.buildr.control(0),
    dependant: this.buildr.control(
      { value: <Dependant>{}, disabled: true },
      Validators.required
    ),
    category: this.buildr.control(Constants.CATEGORY_SHE),
    requestFor: this.buildr.control(''),

    injuryDate: this.buildr.control(
      { value: '', disabled: true },
      Validators.required
    ),
    injuryPlace: this.buildr.control(
      { value: '', disabled: true },
      Validators.required
    ),
    injuryHow: this.buildr.control(
      { value: '', disabled: true },
      Validators.required
    ),
    injuryNature: this.buildr.control(
      { value: '', disabled: true },
      Validators.required
    ),

    illnessDate: this.buildr.control(
      { value: '', disabled: true },
      Validators.required
    ),
    illnessNature: this.buildr.control(
      { value: '', disabled: true },
      Validators.required
    ),
    illnessFirstConsultDate: this.buildr.control(
      { value: '', disabled: true },
      Validators.required
    ),
    illnessFirstDr: this.buildr.control(
      { value: '', disabled: true },
      Validators.required
    ),

    hospitalStartDate: this.buildr.control(''),
    hospitalEndDate: this.buildr.control(''),

    infoTreatment: this.buildr.control('', Validators.required),
    infoHospital: this.buildr.control('', Validators.required),
    infoConsultant: this.buildr.control(''),

    claimDate: this.buildr.control(Utils.today),
    startDate: this.buildr.control(''),
    requestAmount: this.buildr.control('', Validators.required),
    claimStatus: this.buildr.control(Constants.CLAIMSTATUS_PENDING),
  });

  disableDependants(checked: any) {
    if (!checked) this.formGroup.controls.dependant.disable();
    else this.formGroup.controls.dependant.enable();
  }

  disableInjury(checked: any) {
    if (!checked) {
      this.formGroup.controls.injuryDate.disable();
      this.formGroup.controls.injuryPlace.disable();
      this.formGroup.controls.injuryHow.disable();
      this.formGroup.controls.injuryNature.disable();
    } else {
      this.formGroup.controls.injuryDate.enable();
      this.formGroup.controls.injuryPlace.enable();
      this.formGroup.controls.injuryHow.enable();
      this.formGroup.controls.injuryNature.enable();
    }
  }
  disableIllness(checked: any) {
    if (!checked) {
      this.formGroup.controls.illnessDate.disable();
      this.formGroup.controls.illnessNature.disable();
      this.formGroup.controls.illnessFirstConsultDate.disable();
      this.formGroup.controls.illnessFirstDr.disable();
    } else {
      this.formGroup.controls.illnessDate.enable();
      this.formGroup.controls.illnessNature.enable();
      this.formGroup.controls.illnessFirstConsultDate.enable();
      this.formGroup.controls.illnessFirstDr.enable();
    }
  }

  ngOnInit(): void {
    this.member = this.share.getUser();
    //console.log('Member ', this.member);
    if (this.member) {
      this,
        this.member.dependants.forEach((b) => {
          this.claimers.push(b.relationship + '-' + b.name);
        });
    } else {
      this.router.navigate(['/signin']);
    }
  }
  onNotifySelected(schemeTitles: string[]) {
    this.schemeTitles = schemeTitles;
  }
  onNotifySelectedScheme(schemeTitles: Scheme[]) {
    if (schemeTitles.length >= 1) this.schemeTitles = [schemeTitles[0].title];
  }

  closePopup() {
    this.ref.close(this.formGroup.value);
  }

  saveClaim() {
    if (this.schemeTitles == undefined) {
      Constants.Toast.fire('Select Scheme Titles');
      return;
    }

    this.formGroup.patchValue({
      memberId: this.member.id,
      requestFor: this.schemeTitles.toString(),
    });

    console.log('saveClaim send to save ', this.formGroup.value);

    const steps = ['1', '2', '3'];
    const Queue = Swal.mixin({
      progressSteps: steps,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      // optional classes to avoid backdrop blinking between steps
      showClass: { backdrop: 'swal2-noanimation' },
      hideClass: { backdrop: 'swal2-noanimation' },
    });

    (async () => {
      let result = await Queue.fire({
        title: 'Confirm to add new claim',
        icon: 'warning',
        currentProgressStep: 0,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => false,
        preConfirm: async () => {
          let res: any;
          try {
            console.log('saveClaim send to save ', this.formGroup.value);
            res = await this.authService.addClaim(this.formGroup.value);
            console.log('saveClaim received from backend ', res);
          } catch (error) {
            Swal.showValidationMessage(`
          Request failed: ${error}
        `);
          }
          return res;
        },
      });

      if (result.isConfirmed) {
        await Queue.fire({
          title: 'Download Claim Application',
          text: `Claim Saved ref Number: ${result.value}`,
          currentProgressStep: 1,
          confirmButtonText: 'Download',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => false,
          preConfirm: async () => {
            try {
              let response: any = await this.authService.downloadClaim(
                result.value
              );
              let dataType = response.type;
              let binaryData = [];
              binaryData.push(response);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: dataType })
              );
              downloadLink.setAttribute('download', 'Claim form.pdf');
              document.body.appendChild(downloadLink);
              downloadLink.click();
            } catch (error) {
              Swal.showValidationMessage(` ${error} `);
            }
          },
        });
      }

      await Queue.fire({
        title: 'Finish',
        icon: 'success',
        showCancelButton: false,
        currentProgressStep: 2,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          this.closePopup();
        }
      });
    })();
  }
}
