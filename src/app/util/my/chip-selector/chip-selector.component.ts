import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
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

@Component({
  selector: 'app-chip-selector',
  templateUrl: './chip-selector.component.html',
  styleUrls: ['./chip-selector.component.css'],
})
export class ChipSelectorComponent implements OnInit, OnChanges  {
  @Input() category: any
  formGroup: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  allScheme: any[] = [];
  selectedScheme: Scheme[] = [];
  titlesSc!: Observable<Scheme[]>
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  @Output() getScheme = new EventEmitter<Scheme[]>();

  announcer = inject(LiveAnnouncer);
  constructor(private fb: FormBuilder, private schemeService: SchemeService) {
    this.formGroup = this.fb.group({
      schemeTitles: this.fb.control('', [Validators.required]),
    });

  }

  ngOnInit() {
    console.log("selected Category ", this.category)
    this.setupData(this.category)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category']) {
      this.handleCategoryChange(changes['category'].currentValue);
    }
  }
  setupData(cat:any){
    this.allScheme = []
    this.schemeService.getScheme(cat)
      .subscribe((res: any[]) => {
        res.forEach((s) => {
          if (s.title != '') {
            this.allScheme.push(s);
          }
        });
        this.formGroup.get('schemeTitles')!.setValue('');
      });
    this.titlesSc = this.formGroup.get('schemeTitles')!.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filterx(value || ''))
    );
  }

  handleCategoryChange(newCategory: string) {
    this.setupData(newCategory)
  }

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
    // this.titleInput.nativeElement.value = '';
    this.formGroup.get('schemeTitles')!.setValue('');
  }

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