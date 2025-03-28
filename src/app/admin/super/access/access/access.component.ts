import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { Access_type } from 'src/app/Model/role';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css'],
})
export class AccessComponent implements OnInit {
  members: any[] = [];
  roles = Access_type;
  selectedMember: any = null;
  formGroup: FormGroup;
  currentPage = 0;
  pageSize = 10;
  totalMembers = 0;

  constructor(
    private authService: AuthServiceService,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      memberSearch: '',
      memberRoles: [[]],
    });
  }

  ngOnInit(): void {
    this.loadMembers();
    this.setupMemberSearch();
  }

  loadMembers(): void {
    this.authService
      .getMembers(Constants.ALL,
        '',
        this.formGroup.get('memberSearch')!.value,
        'asc',
        this.currentPage,
        this.pageSize,
      )
      .subscribe((member: any) => {
        if (member && member.content) {
          this.members = member.content;
          this.totalMembers = member.totalElements;
        } else {
          this.members =[]; // Set to empty array if member or member.content is null
          this.totalMembers = 0; // Set totalCount to 0 if there's an error
        }
    });
  }

  setupMemberSearch(): void {
    this.formGroup
      .get('memberSearch')!
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchText) => {
          this.currentPage = 0; // Reset to the first page on search
          return searchText
            ? this.authService.getMembers(Constants.ALL,
              '',
              searchText,
              'asc',
              this.currentPage,
              this.pageSize,
            )
            : of({ members: [], total: 0 });
        })
      )
      .subscribe((member: any) => {
        if (member && member.content) {
          this.members = member.content;
          this.totalMembers = member.totalElements;
        } else {
          this.members =[]; // Set to empty array if member or member.content is null
          this.totalMembers = 0; // Set totalCount to 0 if there's an error
        }
    });
  }

  selectMember(member: any): void {
    this.selectedMember = member;
    this.formGroup.patchValue({
      memberRoles: member.roles.map((role: any) => role.role),
    });
  }

  updateRoles(): void {
    if (this.selectedMember) {
      this.authService
        .updateRoles(this.selectedMember.id, this.formGroup.value.memberRoles)
        .subscribe(() => {
          Constants.Toast.fire('Roles updated successfully');
        });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMembers();
  }
  get memberSearchControl(): FormControl {
    return this.formGroup.get('memberSearch') as FormControl;
  }
  get memberRolesControl(): FormControl {
    return this.formGroup.get('memberRoles') as FormControl;
  }
}
