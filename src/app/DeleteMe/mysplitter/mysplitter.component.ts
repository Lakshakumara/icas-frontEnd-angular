
import { SplitComponent, SplitAreaDirective, ISplitDirection } from 'angular-split'
import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core'



@Component({
  selector: 'app-mysplitter',
  templateUrl: './mysplitter.component.html',
  styleUrls: ['./mysplitter.component.css']
})
export class MysplitterComponent {
   
  keepLeft: boolean = true;
}
