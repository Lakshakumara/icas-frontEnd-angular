import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from 'src/app/Model/member';
import { Registration } from 'src/app/Model/registration';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {

  profile!: Member;
  roles!: string[];
  constructor(private router: Router, private share: SharedService, private authService: AuthServiceService) {
    this.profile = this.share.getUser();
    this.roles = this.authService.getRoles();
    if (this.profile != undefined) {
    } else {
      this.router.navigate(['/signin']);
    }
  }
  onEditProfile(): void {
    // Trigger your edit logic here
    // Example: open a dialog or navigate to edit page
    console.log('Edit profile clicked for', this.profile.empNo);
    // e.g., open dialog: this.dialog.open(EditProfileDialogComponent, { data: this.profile });
  }
  get maxYear(): number {
    //if (!this.profile?.memberRegistrations?.length) return null;
    return Math.max(...this.profile.memberRegistrations.map(r => r.year));
  }

  editRegistration(reg: Registration) {  
  this.router.navigate(['/signup', this.profile.empNo, this.maxYear]);
    //this.router.navigate(['/signup/' + this.profile.empNo+'/'+this.maxYear]);
  }

}