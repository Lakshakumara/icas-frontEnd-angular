import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HospitalComponent } from '../pop/hospital/hospital.component';
import { Member } from '../Model/member';
import { Claim } from '../Model/claim';
import { Utils } from '../util/utils';
import { Constants } from '../util/constants';
import { OpdNewComponent } from '../pop/opd-new/opd-new.component';
import Swal from 'sweetalert2';
import { ClaimDetailsDialogComponent } from '../pop/claim-details-dialog/claim-details-dialog.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  member!: Member;
  claimSummary: Claim[] = [];
  opdRequestSum: number = 0;
  opdPaidSum: number = 0;
  hsRequestSum: number = 0;
  hsPaidSum: number = 0;
  isAdmin: boolean = false;
  isUser: boolean = false;
  constructor(
    private auth: AuthServiceService,
    private router: Router,
    private share: SharedService,
    private dialog: MatDialog
  ) {
    this.member = this.share.getUser();
    if (this.member != undefined) {
    } else {
      this.router.navigate(['/signin']);
    }
  }
  ngOnInit(): void {
    console.log("All ", this.member.memberRegistrations)
    const registerOpen = this.member.registrationOpen
    const reg = this.member.memberRegistrations.filter(r => { return r.year === registerOpen })
    console.log("reg ", registerOpen, Utils.currentYear, reg)

    if (registerOpen != 0 && reg) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: `New Registration is available`,
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: `Register Now`
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.member != undefined) {
            this.router.navigate([`/signup/${this.member.empNo}`]);
          } else {
            this.router.navigate([`/signin`]);
          }
        }
      });
    }
    this.loadDashboard();
  }

  loadDashboard() {
    this.auth
      .getDashboardData(Utils.currentYear, this.member.empNo)
      .subscribe((receiveData: any) => {
        this.claimSummary = receiveData;
        if (this.claimSummary)
          this.claimSummary.forEach((c) => {
            if (c.category == Constants.CATEGORY_OPD) {
              this.opdRequestSum += c.requestAmount;
              this.opdPaidSum += c.paidAmount;
            } else if (c.category == Constants.CATEGORY_SHE) {
              this.hsRequestSum += c.requestAmount;
              this.hsPaidSum += c.paidAmount;
            }
          });
      });
  }
  inquiry() {
    Constants.Toast.fire('Under Construction');
  }

  opdClaim() {

    this.Openpopup(0, 'OPD Reimbursement', OpdNewComponent, HomePageComponent);
  }

  Openpopup(id: any, title: any, component: any, parent: any) {
    var _popup = this.dialog.open(component, {
      panelClass: 'fullscreen-dialog',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        title: title,
        id: id,
      },
    });

    _popup.afterClosed().subscribe((item) => {
      this.loadDashboard();
    });
  }

  hospitalClaim() {
    this.Openpopup(
      1,
      'Surgical & Hospital Expenses',
      HospitalComponent,
      HomePageComponent
    );
  }
}
