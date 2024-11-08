import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Member } from 'src/app/Model/member';
import { Constants } from 'src/app/util/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  //"user", "admin", "GADHead", "DepHead", "mo", "mec", "superAdmin"
  roles: string[] = [];
  @Input() member!: Member;
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

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
}
