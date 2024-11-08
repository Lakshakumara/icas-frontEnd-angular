import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Member } from 'src/app/Model/member';
import { Constants } from 'src/app/util/constants';

@Component({
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
