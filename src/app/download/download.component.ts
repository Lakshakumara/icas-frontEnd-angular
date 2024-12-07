import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Utils } from '../util/utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { Member } from '../Model/member';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
import { Constants } from '../util/constants';
import Swal from 'sweetalert2';
import { Claim } from '../Model/claim';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  member!: Member;
  selectedClaimId!: number;
  claimList!: Claim[];
 
  @Output() sidenavClose = new EventEmitter();
  panelOpenState = false;
  appForm = new FormGroup({
    empNo: new FormControl('', [Validators.required]),
    year: new FormControl(0, [Validators.required]),
  });
  selectedYear: number = Utils.currentYear;
  constructor(
    private share: SharedService,
    private auth: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.member = this.share.getUser();
    console.log(this.member)
    if (this.member != null) {
      this.appForm = new FormGroup({
        empNo: new FormControl(this.member.empNo, [Validators.required]),
        year: new FormControl(this.member.currentRegistration.year, [
          Validators.required,
        ]),
      });
    } else {
      this.router.navigate(['/signin']);
    }
    this.auth
      .getAllClaims('', 0, this.member.empNo, Constants.CLAIMSTATUS_PENDING)
      .subscribe((c) => {
        console.log(c.content)
        this.claimList = c.content;
      });
  }
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };

  downloadMembershipApplication() {
    if (this.appForm.value.year == null || this.appForm.value.empNo == null)
      return;
    Constants.Toast.fire('Downloading...');
    this.auth
      .download(1, this.appForm.value.year, this.appForm.value.empNo)
      .subscribe((response: any) => {
        console.log(response.fileNme);
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        //let fname = response.get("file name").ToString();
        //console.log(fname);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        downloadLink.setAttribute('download', 'Application.pdf');
        document.body.appendChild(downloadLink);
        console.log(downloadLink);
        downloadLink.click();
      });
  }

  claimApplication() {
    if (this.selectedClaimId == undefined) {
      return;
    }
    Swal.fire({
      title: 'Download Claim Application',
      icon: 'question',
      confirmButtonText: 'Download',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => false,
      preConfirm: async () => {
        try {
          let response: any = await this.auth.downloadClaim(
            this.selectedClaimId
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
  schemeRegulation() {
    Swal.fire({
      title: 'Download Scheme',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Download',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => false,
      preConfirm: async () => {
        try {
          let response: any = await this.auth.directDownloadx('scheme', '2023');
          const blob = new Blob([response], { type: 'application/pdf' });
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'scheme.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          Swal.showValidationMessage(`Download failed: ${error}`);
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Downloaded!', 'Your file has been downloaded.', 'success');
      }
    });
  }
  
}
