import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Utils } from 'src/app/util/utils';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { Member } from 'src/app/Model/member';
import { Constants } from 'src/app/util/constants';
import { Observable, map, startWith } from 'rxjs';
import { Scheme, SchemeTitles } from 'src/app/Model/scheme';
import { SchemeService } from 'src/app/service/scheme.service';

@Component({
  selector: 'app-opd-new',
  templateUrl: './opd-new.component.html',
  styleUrls: ['./opd-new.component.css']
})
export class OpdNewComponent implements OnInit {
  member!: Member;
  inputdata: any;
  claimTypes: any = ['Outdoor', 'Spectacles', 'Covid Test'];
  today = Utils.today;
  beforeThreeMonth = Utils.threeMonthbeforetoday;
  schemeTitles!: string[];
  opd: string = Constants.CATEGORY_OPD

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<OpdNewComponent>,
    private auth: AuthServiceService,
    private schemeService: SchemeService,
    private buildr: FormBuilder,
    private router: Router,
    private share: SharedService
  ) {
    this.inputdata = this.data;
  }
  dForm = this.buildr.group({
    id: this.buildr.control(''),
    memberId: this.buildr.control(0),
    category: this.buildr.control(Constants.CATEGORY_OPD),
    requestFor: this.buildr.control('',),
    startDate: this.buildr.control(Utils.today, Validators.required),
    claimDate: this.buildr.control(Utils.today, Validators.required),
    applyDate: this.buildr.control(Utils.today),
    requestAmount: this.buildr.control({ value: <number>{}, disabled: false }, Validators.required),
    claimStatus: this.buildr.control(Constants.CLAIMSTATUS_PENDING),
  });
  ngOnInit() {
    this.member = this.share.getUser();
    if (this.member == null) {
      this.router.navigate(['/signin']);
    }
    /* this.schemeService
       .getSchemeTitle(this.opd)
       .subscribe((titles: any) => {
         this.stateGroups = titles;
       });
 
     this.stateGroupOptions = this.dForm
       .get('stateGroup')!
       .valueChanges.pipe(
         startWith(''),
         map((value) => this._filterGroup(value || ''))
       );*/

  }
  onNotifySelectedScheme(schemeTitles: Scheme[]) {
    if (schemeTitles.length >= 1) this.schemeTitles = [schemeTitles[0].title];
  }
  saveValidator() {
    if (!this.dForm.valid) return;
    if (
      this.dForm.value?.requestAmount != undefined &&
      this.dForm.value?.requestAmount > 15000
    ) {
      Swal.fire({
        title: 'Request Amount is exceed the limit',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Proceed',
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveClaim();
        }
      });
    } else this.saveClaim();
  }
  saveClaim() {
    this.dForm.patchValue({
      memberId: this.member.id,
      requestFor: this.schemeTitles.toString(),
    });

    console.log(this.dForm.value)
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
        title: 'Save Claim Details',
        icon: 'warning',
        currentProgressStep: 0,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => false,
        preConfirm: async () => {
          let claimId;
          try {
            claimId = await this.auth.addClaim(this.dForm.value);
            this.dForm.reset();
          } catch (error) {
            return Swal.showValidationMessage(` ${error} `);
          }
          return claimId;
        },
      });

      if (result.isConfirmed) {
        console.log('Saved Result ', result);
        await Queue.fire({
          title: 'Download Claim Application',
          text: `Claim Saved ref Number: ${result.value}`,
          currentProgressStep: 1,
          confirmButtonText: 'Download',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => false,
          preConfirm: async () => {
            try {
              if(result.value == undefined) throw ''
              let claimid : any = result.value;
              let response: any = await this.auth.downloadClaim(claimid);
              console.log('received from backend ', response);

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

  closePopup() {
    this.ref.close(this.dForm.value);
  }
  /* private _filterGroup(value: string): SchemeTitles[] {
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
   }*/
}
