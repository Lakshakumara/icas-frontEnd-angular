import { Component, DoCheck, OnInit } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { Router } from '@angular/router';
import { LoaderService } from './service/loader.service';
import { Member } from './Model/member';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthServiceService } from './service/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck, OnInit {
  title = 'ICAS';
  publicUrlList = ['/signin', '/isValid', '/change-password'];

  member!: Member;
  isMenuShow = false;
  //myLoader = this.loaderService.loadingAction$;
  loading$: Observable<boolean>;
  message$: Observable<string>;
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
}