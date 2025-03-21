import { Component, Input, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-beneficiary-data',
  templateUrl: './beneficiary-data.component.html',
  styleUrls: ['./beneficiary-data.component.css'],
})
export class BeneficiaryDataComponent implements OnInit {
  @Input() member: any;

  constructor(
    private auth: AuthServiceService
  ) { }
  ngOnInit(): void {
    this.auth.getMemberDependants(this.member.empNo)
      .then((dep: any) => {
        this.member.dependants = dep

      })
    this.auth.getMemberBeneficiaries(this.member.empNo)
      .then((ben: any) => {
        this.member.beneficiaries = ben

      })
  }
}
