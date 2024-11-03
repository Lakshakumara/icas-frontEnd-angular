import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SchemeService } from 'src/app/service/scheme.service';
import { Scheme } from 'src/app/Model/scheme';
import { Constants } from '../../constants';

export const _filter = (opt: Scheme[], value: string): Scheme[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(
    (scheme) =>
      scheme.title.toLocaleLowerCase().includes(filterValue) ||
      scheme.idText.toLowerCase().includes(filterValue)
  );
};

/**
 * @title Adding and removing data when using an observable-based datasource.
 */
@Component({
  selector: 'app-chip-selector',
  templateUrl: './chip-selector.component.html',
  styleUrls: ['./chip-selector.component.css'],
})
export class ChipSelectorComponent implements OnInit {
  formGroup: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  allScheme: Scheme[] = [];
  selectedScheme: Scheme[] = [];
  titlesSc!: Observable<Scheme[]>;
  xx: Scheme = {
    id: 0,
    amount: 0,
    descriptionen: '',
    descriptionsi: '',
    descriptionta: '',
    idText: '',
    title: '',
    isEdit: false,
    isSelected: false,
    rate: 0,
    unit: '',
  };

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  @Output() getScheme = new EventEmitter<Scheme[]>();

  announcer = inject(LiveAnnouncer);

  constructor(private fb: FormBuilder, private schemeService: SchemeService) {
    this.formGroup = this.fb.group({
      schemeTitles: this.fb.control('', [Validators.required]),
    });

    this.schemeService.getScheme().subscribe((res: any[]) => {
      res.forEach((s) => {
        if (s.title != '') this.allScheme.push(s);
      });
    });
  }

  ngOnInit() {
    /*this.titlesSc = this.formGroup.get('schemeTitles')!.valueChanges.pipe(
      startWith(null),
      map((scheme: Scheme | null) =>
        scheme?.title ? this._filterx(scheme.title) : this.allScheme.slice()
      )
    );*/

    this.titlesSc = this.formGroup.get('schemeTitles')!.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filterx(value || ''))
    );
  }

  /* add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (this.allScheme.find((s) => s.title == value)) {
      this.getScheme.emit(this.selectedScheme);
    }

    // Clear the input value
    event.chipInput!.clear();
    console.log('add ', value);
    this.formGroup.get('schemeTitles')!.setValue('');
  }*/

  add(event: any): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const matchingScheme = this.allScheme.find(
        (scheme) => scheme.title.toLowerCase() === value.trim().toLowerCase()
      );
      if (matchingScheme) {
        if (!this.selectedScheme.includes(matchingScheme)) {
          this.selectedScheme.push(matchingScheme);
          this.getScheme.emit(this.selectedScheme);
        } else {
          Constants.Toast.fire(value, ' alrady added');
        }
      }
    }

    if (input) {
      input.value = '';
    }
    console.log('add ', value);
    this.formGroup.get('schemeTitles')!.setValue('');
  }

  remove(scheme: Scheme): void {
    const index = this.selectedScheme.indexOf(scheme);
    if (index >= 0) {
      this.selectedScheme.splice(index, 1);
      this.getScheme.emit(this.selectedScheme);
      this.announcer.announce(`Removed ${scheme}`);
    }
  }
  selected(event: any): void {
    const value = event.option.value;
    
    if (!this.selectedScheme.includes(value)) {
      this.selectedScheme.push(value);
      this.getScheme.emit(this.selectedScheme);
    } else {
      Constants.Toast.fire(value.title, ' alrady added');
    }
    this.titleInput.nativeElement.value = '';
    this.formGroup.get('schemeTitles')!.setValue('');
  }
  /*selected(event: MatAutocompleteSelectedEvent): void {
    let zz = this.allScheme.filter((s) => {
      return s.title == event.option.value.title;
    })[0];
    if (!this.selectedScheme.includes(zz)) {
      this.selectedScheme.push(zz);
      this.getScheme.emit(this.selectedScheme);
    }

    this.titleInput.nativeElement.value = '';
    this.formGroup.get('schemeTitles')!.setValue(null);
  }*/

  private _filterx(value: string): Scheme[] {
    let filterValue = '';
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    }
    return this.allScheme.filter(
      (scheme) =>
        scheme.title.toLowerCase().includes(filterValue) ||
        scheme.idText.toLowerCase().includes(filterValue)
    );
  }
}
