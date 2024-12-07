// src/app/services/settings.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../Model/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<Settings>({
    theme: 'light',
    notifications: true,
    autoSave: false,
    language: 'en'
  });
  settings$ = this.settingsSubject.asObservable();

  constructor() {}

  getSettings(): Settings {
    return this.settingsSubject.value;
  }

  updateSettings(settings: Settings): void {
    this.settingsSubject.next(settings);
    // Optionally save to local storage or backend here
  }
}

