import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RoutingModule } from './routing/routing.module';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { LoginV1Component } from './login-v1/login-v1.component';
import { DependantComponent } from './register/dependant/dependant.component';
import { TestComponent } from './test/test.component';
import { ConfirmDialogComponent } from './pop/confirm-dialog/confirm-dialog.component';
import { OpdComponent } from './pop/opd/opd.component';
import { HospitalComponent } from './pop/hospital/hospital.component';
import { SchemePlanComponent } from './admin/super/scheme-plan/scheme-plan.component';
import { LoadingSpinnerComponent } from './decorator/loading-spinner/loading-spinner.component';

import { TableComponent } from './table/table.component';
import { UserOPDComponent } from './tableFactory/user-opd/user-opd.component';
import { ClaimUpdateComponent } from './admin/dep-head/claim-update/claim-update.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { VoucherComponent } from './admin/gad/head/voucher.component';
import { MyTableModule } from './tableFactory/tableModel/table.module';
import { AccessComponent } from './admin/super/access/access/access.component';
import { MecHsComponent } from './DeleteMe/mec-hs/mec-hs.component';
import { BeneficiaryComponent } from './register/beneficiary/beneficiary.component';
import { DownloadComponent } from './download/download.component';
import { MemberComponent } from './admin/dep-head/staff-member/member.component';
import { RegistrationComponent } from './admin/gad/subject/registration/registration.component';

import { AngularSplitModule } from 'angular-split';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProfileComponent } from './login-v1/profile/profile.component';

import { OnlyNumberDirective } from './util/only-number.directive';
import { ClaimManageComponent } from './admin/gad/subject/claim-manage/claim-manage.component';
import { MecComponent } from './admin/mec/mec/mec.component';
import { ChipSelectorComponent } from './util/my/chip-selector/chip-selector.component';

@NgModule({
  declarations: [
    OnlyNumberDirective,
    AppComponent,
    RegisterComponent,
    HomePageComponent,
    HeaderComponent,
    SidenavListComponent,
    LoginV1Component,
    DependantComponent,
    TestComponent,
    ConfirmDialogComponent,
    OpdComponent,
    HospitalComponent,
    SchemePlanComponent,
    LoadingSpinnerComponent,
    TableComponent,
    UserOPDComponent,
    ClaimUpdateComponent,
    AdminPanelComponent,
    TableComponent,
    VoucherComponent,
    AccessComponent,
    MecHsComponent,
    BeneficiaryComponent,
    DownloadComponent,
    MemberComponent,
    RegistrationComponent,
    MemberComponent,
    ProfileComponent,
    ClaimManageComponent,
    MecComponent,
    ChipSelectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RoutingModule,
    MyTableModule,
    AngularSplitModule,
    NgxJsonViewerModule,
    NgMultiSelectDropDownModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
