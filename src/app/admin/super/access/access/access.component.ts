import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, firstValueFrom, of, switchMap } from 'rxjs';
import { Access_type } from 'src/app/Model/role';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { Constants } from 'src/app/util/constants';
import { UserService } from 'src/app/service/user.service';
import { SwalHelperService } from 'src/app/service/swal-helper.service';
@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css'],
})
export class AccessComponent implements OnInit {
  members: any[] = [];
  roles = Access_type;
  selectedMember!: any;
  formGroup: FormGroup;
  currentPage = 0;
  pageSize = 10;
  totalMembers = 0;

  constructor(
    private authService: AuthServiceService,
    private userService: UserService,
    private swalHelper: SwalHelperService,
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
          this.members = []; // Set to empty array if member or member.content is null
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
          this.members = []; // Set to empty array if member or member.content is null
          this.totalMembers = 0; // Set totalCount to 0 if there's an error
        }
      });
  }

  selectMember(member: any): void {
    this.selectedMember = member;
    this.authService.findRoles(this.selectedMember.empNo).then(role => {
      this.formGroup.patchValue({
        memberRoles: role.map((role: any) => role.role),
      });
    });

  }

  async updateRoles(): Promise<void> {
    if (this.selectedMember) {
      const roles = this.formGroup.value.memberRoles;

      const result = await this.swalHelper.confirmWithRetry(
        'Confirm Role Update',
        `Are you sure you want to update roles for ${this.selectedMember.name}?`,
        async () => {
          return await firstValueFrom(
            this.userService.updateRoles(this.selectedMember.empNo, roles)
          );
        }
      );

      if (result) {
        if ((result as any).success) {
          this.swalHelper.showSuccess((result as any).message);
        } else {
          this.swalHelper.showError((result as any).message);
        }
      }
    }
  }

  /*
    updateRoles(): void {
      if (this.selectedMember) {
        Swal.fire({
          title: 'Comfirm before update',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Comfirm',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(), // block outside click only while loading
          preConfirm: async () => {
            try {
              const roles = this.formGroup.value.memberRoles;
              const result = await firstValueFrom(
                this.userService.updateRoles(this.selectedMember.empNo, roles)
              );
              return result;
            } catch (error: any) {
              // Stop loader (disable loading spinner)
              Swal.hideLoading();
              // Show the error message inside the Swal itself
              Swal.showValidationMessage(error.message || 'Failed to update roles');
              // Allow user to close the popup again
              Swal.enableButtons();
  
              // Rethrow to stop confirmation
              throw error;
            }
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const res = result.value;
            Swal.fire('Success', res.message || 'Roles updated successfully', 'success');
          }
        });
      }
    }
  */
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
