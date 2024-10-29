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
import { SchemeTitles } from '../Model/scheme';
import { SchemeService } from '../service/scheme.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

/**
 * @title Adding and removing data when using an observable-based datasource.
 */

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  allTitles: string[] = [];
  selectedTitles: string[] = [];
  titles!: Observable<string[]>;

  formGroup = this.fb.group({
    schemeTitles: new FormControl('', [Validators.required]),
  });

  
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  @Output() getTitles = new EventEmitter();
  
  announcer = inject(LiveAnnouncer);

  constructor(private fb: FormBuilder, private schemeService: SchemeService) {
    this.titles = this.formGroup.get('schemeTitles')!.valueChanges.pipe(
      startWith(null),
      map((title: string | null) => (title ? this._filter(title) : this.allTitles.slice())),
    );
  }

  ngOnInit() {
    
    this.schemeService.getSchemeTitle("all").subscribe((title: SchemeTitles[]) => {
      title.forEach((st)=>{
        st.idText.map((t)=>{
          this.allTitles.push(t);
          
        })
      });
    });
    
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (this.allTitles.includes(value)) {
      this.selectedTitles.push(value);
      this.getTitles.emit(this.selectedTitles)
    }

    // Clear the input value
    event.chipInput!.clear();

    this.formGroup.get('schemeTitles')!.setValue(null);
  }

  remove(title: string): void {
    const index = this.selectedTitles.indexOf(title);

    if (index >= 0) {
      this.selectedTitles.splice(index, 1);
      this.getTitles.emit(this.selectedTitles)
      this.announcer.announce(`Removed ${title}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTitles.push(event.option.viewValue);
    this.getTitles.emit(this.selectedTitles)
    this.titleInput.nativeElement.value = '';
    this.formGroup.get('schemeTitles')!.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTitles.filter((title) =>
      title.toLowerCase().includes(filterValue)
    );
  }
}
