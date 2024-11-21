import { Component, Input } from '@angular/core';
import { Member } from 'src/app/Model/member';

@Component({
  selector: 'app-beneficiary-data',
  templateUrl: './beneficiary-data.component.html',
  styleUrls: ['./beneficiary-data.component.css'],
})
export class BeneficiaryDataComponent {
  @Input() member: any;
}
