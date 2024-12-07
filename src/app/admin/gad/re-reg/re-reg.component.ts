import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { SettingsService } from 'src/app/service/settings.service';
import { Utils } from 'src/app/util/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-re-reg',
  templateUrl: './re-reg.component.html',
  styleUrls: ['./re-reg.component.css']
})
export class ReRegComponent implements OnInit {
  
  @Input() member: any;

  settingsForm: FormGroup;
  currentYear:number = Utils.currentYear
  constructor(
    private fb: FormBuilder,
    private auth:AuthServiceService
  ) {
    this.settingsForm = this.fb.group({
      year: this.fb.control(this.currentYear + 1, [Validators.required]),
      selector: this.fb.control(''),
    });
  }

  ngOnInit(): void {
    
  }
  registrationOpen() {
    if (this.settingsForm.value.selector !== 'all') {
      this.settingsForm.patchValue({
        selector: this.member?.empNo,
      });
    }
    this.auth.update('registerOpen', this.settingsForm.value).subscribe((data) => {
      Swal.fire({
        icon: 'info',
        title: 'Sucess',
        text: 'Updated ' + data + 'rows',
      });
    });
  }

}
