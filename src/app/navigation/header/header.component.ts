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
  roles: string[] = [];
  @Input() member!: Member;
  isUser: boolean = false;
  isAdmin: boolean = false;
  isGADHead: boolean = false;
  isDepHead: boolean = false;
  isMo: boolean = false;
  isMec: boolean = false;
  isSuperAdmin: boolean = false;
  isDarkTheme = false;

  constructor() { }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.updateTheme();
    }

    if (this.member && this.member.roles) {
      this.member.roles.forEach((val) => {
        this.roles.push(val.role);
        switch (val.role) {
          case Constants.ROLE_ADMIN:
            this.isAdmin = true;
            this.isGADHead = true;
            this.isDepHead = true;
            this.isMo = true;
            this.isMec = true;
            this.isSuperAdmin = true;
            break;
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
    }
    this.isUser = this.roles.includes(Constants.ROLE_USER);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.updateTheme();
  }

  private updateTheme() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}

/*export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  roles: string[] = [];
  @Input() member!: Member;
  isUser: boolean = false;
  isAdmin: boolean = false;
  isGADHead: boolean = false;
  isDepHead: boolean = false;
  isMo: boolean = false;
  isMec: boolean = false;
  isSuperAdmin: boolean = false;
  isDarkTheme = false;


  constructor() { }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.updateTheme();
    }

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
  
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.updateTheme();
  }

  private updateTheme() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}*/
