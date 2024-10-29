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
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SchemeService } from 'src/app/service/scheme.service';
import { Scheme, SchemeTitles } from 'src/app/Model/scheme';

export const _filter = (opt: Scheme[], value: string): Scheme[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.title.toLocaleLowerCase() == filterValue);
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
  formGroup = this.fb.group({
    schemeTitles: this.fb.control(<Scheme>{}, [Validators.required]),
  });

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  @Output() getScheme = new EventEmitter<Scheme[]>();

  announcer = inject(LiveAnnouncer);

  constructor(private fb: FormBuilder, private schemeService: SchemeService) {
    this.schemeService.getScheme().subscribe((res: any[]) => {
      res.forEach((s) => {
        if (s.title != '') this.allScheme.push(s);
      });
    });
  }

  ngOnInit() {
    this.titlesSc = this.formGroup.get('schemeTitles')!.valueChanges.pipe(
      startWith(null),
      map((scheme: Scheme | null) =>
        scheme?.title ? this._filter(scheme.title) : this.allScheme.slice()
      )
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (this.allScheme.find((s) => s.title == value)) {
      this.getScheme.emit(this.selectedScheme);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.formGroup.get('schemeTitles')!.setValue(null);
  }

  remove(scheme: Scheme): void {
    const index = this.allScheme.indexOf(scheme);
    if (index >= 0) {
      this.selectedScheme.splice(index, 1);
      this.getScheme.emit(this.selectedScheme);
      this.announcer.announce(`Removed ${scheme}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let zz = this.allScheme.filter((s) => {
      return s.title == event.option.value.title;
    })[0];
    if (!this.selectedScheme.includes(zz)) {
      this.selectedScheme.push(zz);
      this.getScheme.emit(this.selectedScheme);
    }

    this.titleInput.nativeElement.value = '';
    this.formGroup.get('schemeTitles')!.setValue(null);
  }
  private _filter(value: string): Scheme[] {
    console.log('value ', value);
    const filterValue = value.toLowerCase();
    return this.allScheme.filter(
      (title) => title.title.toLowerCase() == filterValue
    );
  }
}
