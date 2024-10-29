import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Member } from 'src/app/Model/member';
import { Scheme } from 'src/app/Model/scheme';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { SchemeService } from 'src/app/service/scheme.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Utils } from 'src/app/util/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html',
  styleUrls: ['./claim-form.component.css']
})
export class ClaimFormComponent implements OnInit {
  member!: Member;
  inputdata: any;
  claimTypes: string[] = [];// = Constants.claimTypes;
  schemeTitles: any = ['title 1', 'title 2', 'title 3'];
  today = Utils.today;
  beforeThreeMonth = Utils.threeMonthbeforetoday;

  schemeData: Scheme[] = [];
  schemeContent: Array<Scheme[]> = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<ClaimFormComponent>,
    private buildr: FormBuilder, private auth: AuthServiceService,
    private schSetvice: SchemeService, private router: Router,
    private share: SharedService) {
    this.inputdata = this.data;
    this.schSetvice.getScheme().subscribe(data => {
      this.schemeData = data;
      this.schemeData.forEach(d=>{
        if(d.unit =='category')
          this.claimTypes.push(d.descriptionen)
      });
    });
  }

  filterSchemeData(index:number): Scheme[] {
    index = index+1;
    const xx =this.schemeData.filter((sc) =>{
      return sc.idText.startsWith(''+index + '.');
    });
    console.log(xx);
    return xx;
  }


  dForm = this.buildr.group({
    id: this.buildr.control(''),
    memberId: new FormControl(),
    /**
     * OPD or SHE(Surgical &Hospital Expenses)
     */
    category: this.buildr.control(''),
    /**
     * Outdoor, Spectacles, covid test etc..
     */
    requestFor: this.buildr.control(''),
    schemeTitle: this.buildr.control(''),
    startDate: this.buildr.control('', Validators.required),
    endDate: this.buildr.control('', Validators.required),
    claimDate: this.buildr.control(new Date, Validators.required),
    applyDate: this.buildr.control(''),
    acceptedDate: this.buildr.control(''),

    requestAmount: this.buildr.control(''),
    deductionAmount: this.buildr.control(''),
    paidAmount: this.buildr.control(''),
    place: this.buildr.control(''),
    nature: this.buildr.control(''),
    incident: this.buildr.control(''),
    claimStatus: this.buildr.control(''),
  });
  ngOnInit() {
    this.member = this.share.getUser();
    if (this.member == null) {
      this.router.navigate(['/signin']);
    }
  }
  addOpdData() {
    this.dForm.patchValue({
      memberId: this.member.id,
      category: "opd",
      claimDate: Utils.today,
      claimStatus: "pending",
    });

    //test
    /*
        Swal.fire({
          title: 'Place a OPD claim',
          text: "Confirm",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Save',
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return fetch(`//claim/opd`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(response.statusText)
                }
                return response.json()
              })
              .catch(error => {
                Swal.showValidationMessage(
                  `Request failed: ${error}`
                )
              })
          },
          allowOutsideClick: () => !Swal.isLoading()})
        .then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: `${result.value.login}'s avatar`,
              imageUrl: result.value.avatar_url
            })
          }
        })
    */

    //end test
    console.log("opd data submit ", this.dForm.value)
    Swal.fire({
      title: 'Place a OPD claim',
      text: "Confirm",
      icon: 'warning',
      //footer: JSON.stringify(this.dForm.value),
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save'
    }).then((result) => {
      if (result.isConfirmed) {
        /*this.auth.saveOPD(this.dForm.value).subscribe(d => {
          Swal.fire(
            'Saved',
            `Your reference number ${d}`,
            'success');
          this.closePopup();
        });*/
      }
    });
  }

  closePopup() {
    console.log('cancel pressed');
    this.ref.close(this.dForm.value);
  }
}
