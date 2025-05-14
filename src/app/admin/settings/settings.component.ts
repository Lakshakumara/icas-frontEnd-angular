import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListItem, MatListModule, MatNavList } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSidenavContainer,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Member } from 'src/app/Model/member';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { SettingsService } from 'src/app/service/settings.service';
import { Utils } from 'src/app/util/utils';

interface Section {
  id: string;
  name: string;
  form: boolean;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  member!: Member;
  currentYear: number = Utils.currentYear;
  settingsForm: FormGroup;
  sections: Section[] = [
    { id: 'renew', name: 'Re registartion', form: true },
    { id: 'general', name: 'General', form: true },
    { id: 'account', name: 'Account', form: true },
    // Add more sections as needed
  ];
  selectedSection: Section = this.sections[0];

  constructor(
    private fb: FormBuilder,
    private auth: AuthServiceService,
    private settingsService: SettingsService
  ) {
    this.settingsForm = this.fb.group({
      year: this.fb.control(this.currentYear + 1, [Validators.required]),
      selector: this.fb.control(''),
      theme: [''],
      notifications: [false],
      autoSave: [false],
      language: [''],
      email: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  selectSection(section: Section): void {
    this.selectedSection = section;
  }

  loadSettings(): void {
    const settings = this.settingsService.getSettings();
    this.settingsForm.patchValue(settings);
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.settingsService.updateSettings(this.settingsForm.value);
      alert('Settings saved successfully');
    }
  }
}
