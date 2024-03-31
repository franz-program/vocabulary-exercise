import {Component, Input} from '@angular/core';
import {Word} from "../../models/word";

@Component({
  selector: 'app-word-displayer',
  standalone: true,
  imports: [],
  templateUrl: './word-displayer.component.html',
  styleUrl: './word-displayer.component.css'
})
export class WordDisplayerComponent {
  @Input() word: Word | undefined;
}
