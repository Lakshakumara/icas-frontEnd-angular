import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Member } from 'src/app/Model/member';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatIcon,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatDividerModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    RouterLink,
    RouterLinkActive
  ],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  roles: string[] = [];
  @Input() member!: Member;
  isDarkTheme = false;

  constructor(public authService: AuthServiceService) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.updateTheme();
    }
/*
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
    }*/
   // this.isUser = this.roles.includes(Constants.ROLE_USER);
  }
  private updateTheme() {
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    document.body.classList.toggle('light-theme', !this.isDarkTheme);
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.updateTheme();
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };
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
