import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNavList } from '@angular/material/list';
import { Member } from 'src/app/Model/member';
import { Constants } from 'src/app/util/constants';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor,
    MatAutocompleteModule, MatIcon, MatCardModule, MatNavList, MatCheckboxModule,
    MatDividerModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  @Input() member!: Member;
  roles: string[] = [];
  isUser: boolean = false;
  isAdmin: boolean = false;
  isGADHead: boolean = false;
  isDepHead: boolean = false;
  isMo: boolean = false;
  isMec: boolean = false;
  isSuperAdmin: boolean = false;

  constructor() {}

  ngOnInit() {
    if (this.member)
      if (this.member.roles)
        this.member.roles.forEach((val, key) => {
          this.roles.push(val.role);
          switch (val.role) {
            case Constants.ROLE_ADMIN: {
              this.isAdmin = true;
              this.isGADHead = true;
              this.isDepHead = true;
              this.isMo = true;
              this.isMec = true;
              this.isSuperAdmin = true;
              break;
            }
            case Constants.ROLE_GAD_HEAD:
              this.isGADHead = true;
              break;
            case Constants.ROLE_DEP_HEAD:
              this.isDepHead = true;
              break;
            case Constants.ROLE_MO:
              this.isMo = true;
              break;
            case Constants.ROLE_MEC:
              this.isMec = true;
              break;
            case Constants.ROLE_SUPER_ADMIN:
              this.isSuperAdmin = true;
              break;
          }
        });
    this.isUser = this.roles.includes(Constants.ROLE_USER);
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
