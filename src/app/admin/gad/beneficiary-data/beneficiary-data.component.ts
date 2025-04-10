import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-beneficiary-data',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTab,
    MatTabGroup,
    MatTableModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './beneficiary-data.component.html',
  styleUrls: ['./beneficiary-data.component.css'],
})
export class BeneficiaryDataComponent implements OnInit {
  @Input() member: any;

  constructor(private auth: AuthServiceService) {}
  ngOnInit(): void {
    this.auth.getMemberDependants(this.member.empNo).then((dep: any) => {
      this.member.dependants = dep;
    });
    this.auth.getMemberBeneficiaries(this.member.empNo).then((ben: any) => {
      this.member.beneficiaries = ben;
    });
  }
}
