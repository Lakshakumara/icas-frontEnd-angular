import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Member } from 'src/app/Model/member';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
})
export class NewUserComponent implements OnInit {
  memberForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthServiceService) {
    this.memberForm = this.fb.group({
      empNo: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.email]],
      contactNo: ['', Validators.required],
      civilStatus: ['', Validators.required],
      nic: ['', Validators.required],
      sex: ['', Validators.required],
      dob: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required],
      photoUrl: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.memberForm.valid) {
      Constants.Toast.fire('Invalid data input');
    }
    const newMember: Member = this.memberForm.value;
    let steps = ['1', '2', '3'];
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
        title: 'Confirm to save data',
        icon: 'warning',
        currentProgressStep: 0,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => false,
        preConfirm: async () => {
          return await this.auth.getHRDetailsNew(newMember.empNo);
        },
      });
      let result1;
      if (result.isConfirmed) {
        let title = `Employee No exists with User ${result.value.name}`;
        if (result.value.id != null) {
          result1 = await Queue.fire({
            title: title,
            text: `Designation: ${result.value.designation} Department: ${result.value.department}`,
            currentProgressStep: 1,
            confirmButtonText: 'Update',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => false,
            preConfirm: async () => {
              try {
                newMember.id = result.value.id;
                this.auth.saveHR(newMember);
              } catch (error) {
                Swal.showValidationMessage(` ${error} `);
              }
            },
          });
        } else {
          this.auth.saveHR(newMember);
        }
      }
      let successTitle = 'Database Updated';
      if (result.isDismissed || result1!.isDismissed) {
        successTitle = 'Cancel';
      }
      await Queue.fire({
        title: successTitle,
        icon: 'success',
        showCancelButton: false,
        currentProgressStep: 2,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          //this.closePopup();
        }
      });
    })();
  }
}
