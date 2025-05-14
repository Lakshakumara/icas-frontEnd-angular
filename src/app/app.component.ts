import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoaderService } from './service/loader.service';
import { Member } from './Model/member';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { LoadingSpinnerComponent } from './decorator/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from './service/auth-service.service';
import { Constants } from './util/constants';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ ADD THIS
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    FlexLayoutModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements DoCheck, OnInit {
  title = 'ICAS';
  menuItems: any[] = []; // Array to store menu items
  roles: string[] = []; // Store user roles
  publicUrlList = ['/signin', '/isValid', '/change-password'];

  member!: Member;
  isMenuShow = false;
  isDarkTheme = false;

  //myLoader = this.loaderService.loadingAction$;
  loading$: Observable<boolean>;
  message$: Observable<string>;

  @ViewChild('sidenav') sidenav?: MatSidenav;

  constructor(
    public authService: AuthServiceService,
    private router: Router,
    private loaderService: LoaderService,
    private share: SharedService
  ) {
    this.loading$ = this.loaderService.loadingAction$;
    this.message$ = this.loaderService.messageAction$;
  }
  ngOnInit(): void {
    console.log('back end ip ', environment.baseUrl);
    this.roles = this.authService.getRoles(); // Get roles from the token
    this.filterMenuItems(); // Filter menu items based on the roles
    this.isDarkTheme = localStorage.getItem('theme') == 'dark';
  }

  filterMenuItems() {
    const allMenuItems = [
      {
        name: 'Home',
        path: '/home',
        roles: ['ROLE_ADMIN', 'ROLE_USER'],
      },
      { name: 'Sign out', path: '/signin', roles: ['ROLE_ADMIN', 'ROLE_USER'] },
      { name: 'Claim History', path: '/c_history', roles: ['ROLE_USER'] },
      { name: 'Download', path: '/download', roles: ['ROLE_USER'] },
      { name: 'Profile', path: '/profile', roles: ['ROLE_USER'] },
      // { name: 'Admin', path: '/admin', roles: ['ROLE_ADMIN'] },
      // Add more menu items as needed
    ];
    this.menuItems = allMenuItems.filter((item) =>
      item.roles.some((role) => this.roles.includes(role))
    );
  }

  ngDoCheck(): void {
    const currentUrl = this.router.url;
    this.isMenuShow = !this.publicUrlList.includes(currentUrl);
    if (this.isMenuShow) {
      this.member = this.share.getUser();
    }
  }

  navigateTo(path: string, sidenav: any) {
    this.router.navigate([path]);
    sidenav.close();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.updateTheme();
  }

  private updateTheme(): void {
    const body = document.body;
  body.classList.toggle('dark-theme');
  body.classList.toggle('light-theme');

    /*const classList = document.body.classList;
    classList.remove('dark-theme');
    classList.remove('light-theme');

    classList.add(this.isDarkTheme ? 'dark-theme' : 'light-theme');*/
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
