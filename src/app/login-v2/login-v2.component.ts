import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { LoaderService } from '../service/loader.service';
import { Utils } from '../util/utils';
import Swal from 'sweetalert2';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-v2',
  //standalone: true,
  //imports: [],
  templateUrl: './login-v2.component.html',
  styleUrls: ['./login-v2.component.css']
})
export class LoginV2Component implements OnInit {
  empNoForm!: FormGroup;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private share: SharedService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.autoLogin();
  }

  private initForm() {
    this.empNoForm = new FormGroup({
      empNo: new FormControl('', [Validators.required]),
    });
  }

  // 🔹 Auto login with existing valid token
  private async autoLogin() {
    const token = this.authService.getToken();
    if (!token) return;

    this.loaderService.showLoader('Verifying existing session...');
    const isValid = await firstValueFrom(this.authService.validateToken());
    if (isValid) {
      const decoded = this.authService.decodeToken();
      const empNo = decoded?.sub;

      if (empNo) {
        const member = await firstValueFrom(this.authService.getMemberNew(empNo));
        this.share.setUser(member);
        const isDefaultPassword = this.authService.isDefaultPassword();
        this.router.navigate([isDefaultPassword ? '/change-password' : '/home']);
      }
    } else {
      this.authService.logout();
    }
    this.loaderService.hideLoader();
  }

  // 🔹 Manual login flow
  async isMemberNew(): Promise<void> {
    const empNo = this.empNoForm.value.empNo?.trim();
    if (!empNo) return;

    try {
      this.loaderService.showLoader('Fetching member details...');
      /* const member = await firstValueFrom(this.authService.getMemberNew(empNo).pipe(
         catchError(() => of(null))
       ));*/
      const member = await firstValueFrom(this.authService.checkMember(empNo));
      if (!member.exists) {
        this.loaderService.hideLoader();
        await Swal.fire('Not Found', 'No member found with this Employee No.', 'error');
        return;
      }

      this.loaderService.hideLoader();

      const { value: password } = await Swal.fire({
        title: 'Enter password',
        input: 'password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
          maxlength: '20',
          autocapitalize: 'off',
          autocorrect: 'off',
        },
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        preConfirm: (pass) => {
          if (!pass) Swal.showValidationMessage('Password required');
          return pass;
        },
      });

      if (!password) return;

      this.loaderService.showLoader('Logging in...');
      const response = await firstValueFrom(this.authService.login(empNo, password)) as { token: string };
      this.authService.saveToken(response.token);

      // Fetch member again to ensure fresh data
      const updatedMember = await firstValueFrom(this.authService.getMemberNew(empNo));
      this.share.setUser(updatedMember);

      const currentYear = Utils.currentYear;
      const reg = updatedMember.memberRegistrations.find(
        (r) => r.year == currentYear && r.acceptedDate != null
      );

      if (reg) {
        const isDefaultPassword = this.authService.isDefaultPassword();
        this.loaderService.updateMessage('Redirecting...');
        await this.delay(100);
        this.router.navigate([isDefaultPassword ? '/change-password' : '/home']);
      } else {
        this.loaderService.hideLoader();
        const regNext = updatedMember.memberRegistrations.find(
          (r) => r.year == currentYear + 1
        );
        if (regNext) {
          Swal.fire(
            `Registered for year ${currentYear + 1}`,
            `No access for ${currentYear}`,
            'warning'
          );
        } else {
          Swal.fire('Membership Pending', 'Contact Department Head', 'warning');
        }
        this.router.navigate(['/signin']);
      }
    } catch (error: any) {
      //this.loaderService.hideLoader();
      Swal.fire('Error', error.message || 'Unexpected error occurred', 'error');
    } finally {
      this.loaderService.hideLoader();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
