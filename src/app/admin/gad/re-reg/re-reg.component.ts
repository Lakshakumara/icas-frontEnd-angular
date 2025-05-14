import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatColumnDef, MatTableModule } from '@angular/material/table';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { SettingsService } from 'src/app/service/settings.service';
import { Utils } from 'src/app/util/utils';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  selector: 'app-re-reg',
  templateUrl: './re-reg.component.html',
  styleUrls: ['./re-reg.component.css'],
})
export class ReRegComponent implements OnInit {
  @Input() member: any;

  settingsForm: FormGroup;
  currentYear: number = Utils.currentYear;
  constructor(private fb: FormBuilder, private auth: AuthServiceService) {
    this.settingsForm = this.fb.group({
      year: this.fb.control(this.currentYear + 1, [Validators.required]),
      selector: this.fb.control(''),
    });
  }

  ngOnInit(): void {}
  registrationOpen() {
    if (this.settingsForm.value.selector !== 'all') {
      this.settingsForm.patchValue({
        selector: this.member?.empNo,
      });
    }
    this.auth
      .update('registerOpen', this.settingsForm.value)
      .subscribe((data) => {
        Swal.fire({
          icon: 'info',
          title: 'Sucess',
          text: 'Updated ' + data + 'rows',
        });
      });
  }
}
