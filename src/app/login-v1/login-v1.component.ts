import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { LoaderService } from '../service/loader.service';
import { Utils } from '../util/utils';
import Swal from 'sweetalert2';
import { Scheme } from '../Model/scheme';
import { Observable, of, delay, switchMap } from 'rxjs';
import { Constants } from '../util/constants';

@Component({
  selector: 'app-login-v1',
  templateUrl: './login-v1.component.html',
  styleUrls: ['./login-v1.component.css'],
})
export class LoginV1Component implements OnInit {
  empNoForm!: FormGroup;
  schemas!: Scheme[];
  loader: any;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private share: SharedService,
    private loaderService: LoaderService
  ) {
    this.share.setUser(null);
  }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.empNoForm = new FormGroup({
      empNo: new FormControl('', [Validators.required]),
    });
  }
  async isMemberNew() {
    try {
      // Show loader with initial message
      this.loaderService.showLoader('Fetching member details...');
      await this.delay(100);
      const { value: password } = await Swal.fire({
        title: 'Enter password',
        input: 'password',
        inputLabel: 'Password',
        inputPlaceholder: 'Enter your password',
        inputAttributes: {
          maxlength: '10',
          autocapitalize: 'off',
          autocorrect: 'off',
        },
      });
      if (password) {
        this.authService
          .login(this.empNoForm.value.empNo, password)
          .subscribe(
            async (response: any) => {
              this.authService.saveToken(response.token);

              // Member found
              this.loaderService.updateMessage(
                'Checking registration status...'
              );
              await this.delay(100);
              let member = await this.authService.getMemberNew(this.empNoForm.value.empNo);

              const reg = member.memberRegistrations.find(
                (r) => r.year == Utils.currentYear && r.acceptedDate != null
              );

              if (reg !== undefined) {
                // Registration OK, navigate to home
                this.loaderService.updateMessage(
                  'Registration found. Redirecting to home page...'
                );
                //await this.delay(100);
                this.share.setUser(member);
                const isDefaultPassword = this.authService.isDefaultPassword();
                  if (isDefaultPassword) {
                    this.router.navigate(['/change-password']);
                  } else {
                    this.router.navigate(['/home']);
                  }
              } else {
                const regnext = member.memberRegistrations.find(
                  (r) => r.year == Utils.currentYear + 1
                );
                if (regnext !== undefined) {
                  // Registered for next year, navigate to signin
                  Swal.fire(
                    `Registered for year ${Utils.currentYear + 1}`,
                    `No access for current Year ${Utils.currentYear}`,
                    'warning'
                  );
                  this.router.navigate(['/signin']);
                } else {
                  // Registration process ongoing, navigate to signin
                  Swal.fire(
                    'Membership accept pending',
                    'Contact Department Head',
                    'warning'
                  );
                  this.router.navigate(['/signin']);
                }
              }
            },
            (error: any) => {
              alert(error.error.message);
              return;
            }
          );
        //let correctUser = await this.authService.isCorrectUser(this.empNoForm.value.empNo, password);
      } else {
        return;
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while processing your request.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      this.loaderService.hideLoader();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  resetEmpNoForm(): void {
    this.empNoForm.reset();
    this.empNoForm.markAsPristine();
    this.empNoForm.markAsUntouched();
    this.empNoForm.updateValueAndValidity();
  }
}