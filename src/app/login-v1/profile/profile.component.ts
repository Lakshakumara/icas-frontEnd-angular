import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from 'src/app/Model/member';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profile!: Member;
  constructor(private router: Router, private share: SharedService) {
    this.profile = this.share.getUser();
    if (this.profile != undefined) {
    } else {
      this.router.navigate(['/signin']);
    }
  }
}
