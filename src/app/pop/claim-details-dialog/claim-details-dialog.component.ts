import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Claim } from 'src/app/Model/claim';
import { AuthServiceService } from 'src/app/service/auth-service.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon,
    MatAutocompleteModule, MatProgressSpinner, MatCardModule, MatCheckboxModule,
    MatDividerModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  selector: 'app-claim-details-dialog',
  templateUrl: './claim-details-dialog.component.html',
  styleUrls: ['./claim-details-dialog.component.css']
})
export class ClaimDetailsDialogComponent {
  currentIndex: number;
  claim!: Claim
  constructor(
    public dialogRef: MatDialogRef<ClaimDetailsDialogComponent>,
    private auth: AuthServiceService,
    @Inject(MAT_DIALOG_DATA) public data: { claimId: any, claimIds: any[] }
  ) { 
    this.currentIndex = data.claimIds.findIndex(index => index === data.claimId); 
    this.loadClaim()
  }

  previousClaim(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this.loadClaim()
  }

  nextClaim(): void {
    if (this.currentIndex < this.data.claimIds.length - 1) {
      this.currentIndex++;
    }
    this.loadClaim()
  }
  loadClaim() {
    this.auth.getClaimNew(this.data.claimIds[this.currentIndex]).then(claim => {
      console.log("received claim ", claim)
      this.claim = claim
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
