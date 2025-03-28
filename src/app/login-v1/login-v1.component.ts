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
      // Fetch member details
      /*let member = await this.authService.getMemberNew(
        this.empNoForm.value.empNo
      );*/

      if (true) {//member.id != null
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
              async (response:any) => {
                //console.log("received ", response.token)
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
                  this.router.navigate(['/home']);
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
              (error:any) => {
                alert('Invalid credentials');
                return;
              }
            );
          //let correctUser = await this.authService.isCorrectUser(this.empNoForm.value.empNo, password);
        } else {
          return;
        }
      } else {
        // Member not found, check HR database
        this.loaderService.updateMessage(
          'Member not found. Checking HR database...'
        );
        await this.delay(100);
        const hr = await this.authService.getHRDetailsNew(
          this.empNoForm.value.empNo
        );
        if (hr.empNo != null) {
          // Employee found in HR, navigate to signup
          this.loaderService.updateMessage(
            'Employee found in HR. Redirecting to signup...'
          );
          await this.delay(100);
          this.share.setUser(hr);
          this.router.navigate(['/signup']);
        } else {
          // Invalid employee number, show error
          Swal.fire({
            title: 'Employee Number is Wrong',
            icon: 'error',
            confirmButtonText: 'Exit',
          });
          this.resetEmpNoForm();
          this.router.navigate(['/signin']);
        }
      }
    } catch (error) {
      //console.error('Error performing tasks', error);
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

/* isMemberNewdelete() {

   let member = await this.authService.getMemberNew(this.empNoForm.value.empNo)

   if (member.id != null) {
     //member found
     const reg = member.memberRegistrations.find((r) => {
       return (
         r.year == Utils.currentYear && r.acceptedDate != null
       );
     });
     if (reg !== undefined) {
       //registration ok visit home page
       this.share.setUser(member);
       this.router.navigate(['/home']);
     } else {
       const regnext = member.memberRegistrations.find((r) => {
         return (
           r.year == Utils.currentYear + 1
         );
       });
       if (regnext !== undefined) {
         //register for next year back to signin
         Swal.fire(
           `Registered for year ${Utils.currentYear + 1}`,
           `No access for current Year ${Utils.currentYear}`,
           'warning'
         );
         this.router.navigate(['/signin']);
       }
       //rejct login registration precees is on going
       Swal.fire(
         'Membership accept pending',
         `Contact Department Head`,
         'warning'
       );
     }

   } else {
     //not the member check Hr database
     const hr = await this.authService.getHRDetailsNew(this.empNoForm.value.empNo)
     if (hr.empNo != null) {
       //employee found in hr registration page
       this.share.setUser(hr);
       this.router.navigate(['/signup']);
     } else {
       //error not a valid employee number
       Swal.fire({
         title: 'Employee Number is Wrong',
         icon: 'error',
         confirmButtonText: 'Exit',
       });
       this.resetEmpNoForm()
       this.loader.hideLoader();
       this.router.navigate(['/signin']);
     }
   }
   this.loader.hideLoader();
 }*/

/*isMember() {
 this.authService
   .isGuest(Utils.currentYear, this.empNoForm.value.empNo)
   .subscribe({
     next: (user: any) => {

       if (user.isMember == false) {
         this.authService.getHRDetails(this.empNoForm.value.empNo)
           .subscribe({
             next: (user) => {
               if (user.id == null) {
                 Swal.fire({
                   title: 'Employee Number is Wrong',
                   icon: 'error',
                   confirmButtonText: 'Exit',
                 });
                 this.resetEmpNoForm()
                 return;
               } else {
                 this.share.setUser(user);
                 this.router.navigate(['/signup']);
               }
             },
             error: (error) => {
               Swal.fire(error.statusText, 'Try again', 'error');
             },
           });
       } else {
         this.authService
           .getMemberold(this.empNoForm.value.empNo)
           .subscribe((member) => {
             if (member) {
               console.log('member ', member)
               this.share.setUser(member);
               const reg = member.memberRegistrations.find((r) => {
                 return (
                   r.year == Utils.currentYear && r.acceptedDate != null
                 );
               });
               if (reg !== undefined) {
                 this.router.navigate(['/home']);
               } else {
                 Swal.fire(
                   'Membership is not accepted',
                   `Contact Department Head`,
                   'warning'
                 );
               }
             }
           });
       }
     },
     error: (error) => {
       console.log(error);
       Swal.fire(error.statusText, 'Try again', 'error');
     },
   });
 this.loader.hideLoader();
}*/

/*getHrDetails(empNo: string) {
  this.authService.getHRDetails(empNo).subscribe((result) => {
    if (result == null) {
      console.log('not in Hr Details');
    } else {
      this.isMember();
    }
  });
}*/

/*delayx() {
  // Simulate a delay of 3 seconds (3000 milliseconds)
  setTimeout(() => {
    // Simulate fetching data
    this.simulateDataFetching().subscribe(data => {
      // Handle data (this example just logs the data)
      console.log(data);
      // Hide loader after data is fetched
      this.loader.hideLoader();
    });
  }, 5000);
}
// Simulate data fetching method
simulateDataFetching(): Observable<any> {
  return of({ data: 'Sample data' }).pipe(delay(5000)); // Simulate a delay in data fetching
}
*/

/*isMember1() {
  const steps = ['Checking', '2', '3'];
  const Queue = Swal.mixin({
    progressSteps: steps,
    showClass: { backdrop: 'swal2-noanimation' },
    hideClass: { backdrop: 'swal2-noanimation' },
  });

  (async () => {
    let result = await Queue.fire({
      title: 'Checking',
      icon: 'warning',
      currentProgressStep: 0,
      //showLoaderOnConfirm: true,
      allowOutsideClick: () => false,
      preConfirm: async () => {
        let response = await this.authService
          .getMember(this.empNoForm.value.empNo);
        if (response) {
          console.log('member ', response)
          this.share.setUser(response);
          /*const reg = response.memberRegistrations.find((r) => {
            return (
              r.year == Utils.currentYear && r.acceptedDate != null
            );
          });
          if (reg !== undefined) {
            this.router.navigate(['/home']);
          } else {
            Swal.fire(
              'Membership is not accepted',
              `Contact Department Head`,
              'warning'
            );
          }*/
/*  }
  return response;
},
});
await Queue.fire({
title: 'Finish',
icon: 'success',
showCancelButton: false,
currentProgressStep: 2,
confirmButtonText: 'OK',
});
})();
}*/

/*Swal.fire({
  title: 'Auto close alert!',
  text: 'I will close in 2 seconds.',
  timer: 2000,
  timerProgressBar: true,
  didOpen:(toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})*/
/*Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  color: '#EBF1F5',
  background: '#1d2333',
  showCancelButton: true,
  reverseButtons: true,
  confirmButtonColor: '#bd1d32',
  cancelButtonColor: '#1d2333',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
  };
});*/
/*
Swal.fire({
  title: `Confirm to submit Data ?`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, Submit!',
  showLoaderOnConfirm: true,
  preConfirm: async () => {
    try {
      Swal.showValidationMessage(`processing...`);
      await timer(3000).pipe(take(1)).toPromise();
      Swal.showValidationMessage(`process`);
    } catch (error) {
      Swal.showValidationMessage(`Request failed: ${error}`);
    }
  },
  allowOutsideClick: () => !Swal.isLoading()
}).then((result) => {
  if (result.isConfirmed) {
    console.log('result confirm')
    
  }else{
    console.log('result not confirm')
  }
});*/
