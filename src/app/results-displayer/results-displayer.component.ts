import {Component, Input} from '@angular/core';
import {Word} from "../../models/word";
import {skip} from "rxjs";

@Component({
  selector: 'app-results-displayer',
  standalone: true,
  imports: [],
  templateUrl: './results-displayer.component.html',
  styleUrl: './results-displayer.component.css'
})
export class ResultsDisplayerComponent {
  @Input() correctAttempts: Word[] = [];
  @Input() wrongAttempts: Word[] = [];
  @Input() skippedAttempts: Word[] = [];

  protected readonly skip = skip;
}
