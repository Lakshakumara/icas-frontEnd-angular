import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { LoaderService } from '../service/loader.service';
import { Utils } from '../util/utils';
import Swal from 'sweetalert2';
import { Scheme } from '../Model/scheme';

@Component({
  selector: 'app-login-v1',
  templateUrl: './login-v1.component.html',
  styleUrls: ['./login-v1.component.css'],
})
export class LoginV1Component implements OnInit {
  empNoForm!: FormGroup;
  schemas!: Scheme[];

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private share: SharedService,
    private loader: LoaderService
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

  getDetails() {
    if (this.empNoForm.valid) {
      /* this.authService.getMember(this.empNoForm.value.empNo).subscribe({
        next: (member) => {
          //member.memberRegistrations.
          if (member.status == 'pending') {
            console.log('new User redirected to user Sign up');
            this.router.navigate(['/signup']);
          } else alert(member.status);
        },
        error: (error) => {
          Swal.fire('Error' + `${error.Reason}`, 'error');
        },
      });*/
    }
  }
  isMember1() {
    /* Constants.Toast.fire({
       icon: "success",
       title: "Signed in successfully"
     });*/

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
          let response = await this.authService.updateMember('memberAccept', {
            name: 'manjula',
          });

          return response;
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
              let response: any = await this.authService.downloadClaim(2);
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
      });
    })();

    /*Swal.fire({
      title: 'Update Claim Data',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Update',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          let res = await this.authService.updateMember('memberAccept', {
            name: 'manjula',
          });
          console.log('Claim Saved ref Number ', res);
          Swal.showValidationMessage(`Claim Saved ref Number: ${res}`);
 
          let down = await this.authService.downloadClaim(1);
          console.log('received from backend ', down);
          Swal.showValidationMessage(`Claim form downing..`);
        } catch (error) {
          Swal.showValidationMessage(`
          Request failed: ${error}
        `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log('result ', result.value);
      if (result.isConfirmed) {
        Swal.fire('Saving', '', 'success');
        this.loadMemberPage();
      } else {
        console.log('error');
      }
    });*/
  }
  loadMemberPage() {
    console.log('finished');
  }
  isMember() {
    /**
     * try with stepper
     */
    if (!this.empNoForm.valid) {
      Swal.fire('Please Enter Employee Number');
      this.empNoForm.reset();
      return;
    }
    this.authService
      .isGuest(Utils.currentYear, this.empNoForm.value.empNo)
      .subscribe({
        next: (user: any) => {
          if (user.isMember == false) {
            this.authService
              .getHRDetails(this.empNoForm.value.empNo)
              .subscribe({
                next: (user) => {
                  if (user == null) {
                    Swal.fire({
                      title: 'Employee Number is Wrong',
                      icon: 'error',
                      confirmButtonText: 'Exit',
                    });
                    this.empNoForm.reset();
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
            //Is a Valid Staff Member check for current year registration

            this.authService
              .getMemberold(this.empNoForm.value.empNo)
              .subscribe((member) => {
                if (member) {
                  
                  console.log('member ',member)
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
  }

  getHrDetails(empNo: string) {
    this.authService.getHRDetails(empNo).subscribe((result) => {
      if (result == null) {
        console.log('not in Hr Details');
      } else {
        this.isMember();
      }
    });
  }

  stepperMsg() {
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
          let response = await this.authService.updateMember('memberAccept', {
            name: 'manjula',
          });

          return response;
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
              let response: any = await this.authService.downloadClaim(1);
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
      });
    })()
  }

}
/*
//loading logo and success
Swal.fire({
  title: 'Update Details',
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: 'Update',
  showLoaderOnConfirm: true,
  preConfirm: async () => {
    try {
      let res = await this.authService.updateMember('memberAccept', {
        name: 'manjula',
      });
      console.log('received from backend ', res);
      //return res;
    } catch (error) {
      Swal.showValidationMessage(`
      Request failed: ${error}
    `);
    }
  },
  allowOutsideClick: () => !Swal.isLoading(),
}).then((result) => {
  console.log('result ', result.value);
  if (result.isConfirmed) {
    Swal.fire('Saving', '', 'success');
    this.loadMemberPage();
  } else {
    console.log('error');
  }
});


end*/

/*registerProcess() {
  Swal.fire({
    title: `Download pdf`,
    icon: 'success',
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true,
    preConfirm: async () => {
      console.log('preConfirm');
      this.authService.registert('Manjula').subscribe((result) => {
        console.log(result);
        this.authService.getMember('100').subscribe((m) => {
          this.share.setUser(m);
          //this.formGroup.reset();
          //this.router.navigate(['/home']);

          Swal.fire({
            title: `Download preConfirm`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Save',
            allowOutsideClick: () => false,
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('preConfirm result.isConfirmed ');
            } else {
              console.log('preConfirm result.isConfirmed else ');
            }
          });
        });
        this.home();
      });
    },
    allowOutsideClick: () => false,
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('result.isConfirmed ');
      this.authService.registert('Manjula').subscribe((result) => {
        console.log(result);

        Swal.fire({
          title: `registert Download clicked`,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Save',
          allowOutsideClick: () => false,
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('registert result.isConfirmed ');
            this.authService.registert('Manjula').subscribe((result) => {
              console.log(result);
              this.home();
            });
          } else {
            console.log('registert result.isConfirmed else ');
          }
        });
      });
    } else {
      console.log('then result.isConfirmed else ');
    }
  });
  console.log('after swal ');*/
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
/*

Swal.fire({
  title: `Confirm to submit Data ?`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, Submit!'
}).then((result) => {
  if (result.isConfirmed) {
    this.setDep();
    this.setBen();
    this.formGroup.patchValue({
      roles: [{ role: "user" }],
      memberRegistrations: [{ id: null, year: Utils.currentYear, schemeType: this.schemeType }],
      mDate: Utils.today,
      registrationOpen: 0,
      status: "pending",
      password:"user",
      scheme: this.schemeType,
    });

    console.log("form generated values ", this.formGroup.value);
    this.authService.register(this.formGroup.value).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        downloadLink.setAttribute('download', "Application.pdf");
        document.body.appendChild(downloadLink);
        console.log(downloadLink)
        downloadLink.click();
      }
    );
  }
});
}*/
/*
  onNotifySelected(scheme: any) {
    this.schemas = scheme;

    console.log(scheme)
  }*/
