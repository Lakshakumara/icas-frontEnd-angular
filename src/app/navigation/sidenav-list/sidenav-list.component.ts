import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Member } from 'src/app/Model/member';

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
            case 'admin': {
              this.isAdmin = true;
              this.isGADHead = true;
              this.isDepHead = true;
              this.isMo = true;
              this.isMec = true;
              this.isSuperAdmin = true;
              break;
            }
            case 'GADHead':
              this.isGADHead = true;
              break;
            case 'DepHead':
              this.isDepHead = true;
              break;
            case 'mo':
              this.isMo = true;
              break;
            case 'mec':
              this.isMec = true;
              break;
            case 'superAdmin':
              this.isSuperAdmin = true;
              break;
          }
        });
    this.isUser = this.roles.includes('user');
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
