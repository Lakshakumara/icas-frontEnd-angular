import { Component, DoCheck, OnInit } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { Router, RouterOutlet } from '@angular/router';
import { LoaderService } from './service/loader.service';
import { Member } from './Model/member';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { LoadingSpinnerComponent } from './decorator/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true, // ✅ ADD THIS
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    SidenavListComponent,
    HeaderComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck, OnInit {
  title = 'ICAS';
  member!: Member;
  isMenuShow = false;
  //myLoader = this.loaderService.loadingAction$;
  loading$: Observable<boolean>;
  message$: Observable<string>;
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private share: SharedService
  ) {
    this.loading$ = this.loaderService.loadingAction$;
    this.message$ = this.loaderService.messageAction$;
  }
  ngOnInit(): void {
    console.log('back end ip ', environment.baseUrl);
  }

  ngDoCheck(): void {
    let currentUrl = this.router.url;
    if (currentUrl == '/isValid' || currentUrl == '/signin') {
      this.isMenuShow = false;
    } else {
      this.member = this.share.getUser();
      this.isMenuShow = true;
    }
  }
}
