import { HomePageComponent } from './../home-page/home-page.component';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { LoginV1Component } from '../login-v1/login-v1.component';
import { SchemePlanComponent } from '../admin/super/scheme-plan/scheme-plan.component';
import { ClaimUpdateComponent } from '../admin/dep-head/claim-update/claim-update.component';
import { VoucherComponent } from '../admin/gad/head/voucher.component';
import { UserOPDComponent } from '../tableFactory/user-opd/user-opd.component';
import { AccessComponent } from '../admin/super/access/access/access.component';
import { DownloadComponent } from '../download/download.component';
import { MemberComponent } from '../admin/dep-head/staff-member/member.component';
import { RegistrationComponent } from '../admin/gad/subject/registration/registration.component';
import { ProfileComponent } from '../login-v1/profile/profile.component';
import { ClaimManageComponent } from '../admin/gad/subject/claim-manage/claim-manage.component';
import { MecComponent } from '../admin/mec/mec/mec.component';
import { Constants } from '../util/constants';
import { DirectDownloadComponent } from '../download/directdownload.component';
import { DownloadGuard } from '../download.guard';
const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  {
    path: 'signup/:empNo',
    component: RegisterComponent,
    title: 'Search for Employee data',
  },
  { path: 'signin', component: LoginV1Component },
  { path: 'signup', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'c_history', component: UserOPDComponent },

  { path: 'download', component: DownloadComponent },
  { path: 'download/:scheme/:version',  component: DirectDownloadComponent, canActivate: [DownloadGuard] },
  { path: 'download/application/:year/:empNo', component: DirectDownloadComponent },

  { path: 'admin/head/member', component: MemberComponent },
  { path: 'admin/head/claim', component: ClaimUpdateComponent },
  { path: 'admin/gad/subject/reg', component: RegistrationComponent },
  { path: 'admin/gad/subject/claimupdate', component: ClaimManageComponent },
  { path: 'admin/gad/subject/voucher', component: VoucherComponent },

  {
    path: 'admin/mec/opd',
    component: MecComponent,
    data: { param: Constants.CATEGORY_OPD },
  },
  {
    path: 'admin/mec/hs',
    component: MecComponent,
    data: { param: Constants.CATEGORY_SHE },
  },

  { path: 'admin/super/scheme', component: SchemePlanComponent },
  { path: 'admin/super/access', component: AccessComponent },
  { path: '**', component: LoginV1Component },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class RoutingModule {}
