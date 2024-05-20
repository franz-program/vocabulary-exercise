import {Component, Input} from '@angular/core';
import {Word} from "../../models/word";
import {skip} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {WordsResultDisplayerComponent} from "../words-result-displayer/words-result-displayer.component";
import {ResultType} from "../../models/result";

@Component({
  selector: 'app-results-displayer',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    WordsResultDisplayerComponent
  ],
  templateUrl: './results-displayer.component.html',
  styleUrl: './results-displayer.component.css'
})
export class ResultsDisplayerComponent {
  @Input() correctAttempts: Word[] = [];
  @Input() wrongAttempts: Word[] = [];
  @Input() skippedAttempts: Word[] = [];

  protected readonly skip = skip;
  protected readonly window = window;
  protected readonly ResultType = ResultType;
}
