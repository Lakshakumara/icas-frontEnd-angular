import { Component, Input } from '@angular/core';
import { Member } from 'src/app/Model/member';

@Component({
  selector: 'app-dependant-data',
  templateUrl: './dependant-data.component.html',
  styleUrls: ['./dependant-data.component.css'],
})
export class DependantDataComponent {
  @Input() member!: Member;
}
