import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from 'src/app/Model/member';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  member!: Member;
  constructor(private router: Router, private share: SharedService) {
    this.member = this.share.getUser();
    if (this.member != undefined) {
    } else {
      this.router.navigate(['/signin']);
    }
  }
}
