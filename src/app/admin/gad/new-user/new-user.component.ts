import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Member } from 'src/app/Model/member';
import { AuthServiceService } from 'src/app/service/auth-service.service';

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
    if (this.memberForm.valid) {
      const newMember: Member = this.memberForm.value;
      this.auth.saveHR(newMember);
    }
  }
}
