import {Component, Input} from '@angular/core';
import {Word} from "../../models/word";
import {ResultType} from "../../models/result";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-words-result-displayer',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './words-result-displayer.component.html',
  styleUrl: './words-result-displayer.component.css'
})
export class WordsResultDisplayerComponent {

  @Input() words: Word[] = [];
  @Input() resultType: ResultType = ResultType.RIGHT;

  getWordsOrdered(): Map<string, Word[]> {
    let wordsByClass = new Map<string, Word[]>();
    this.words.forEach(word => {
      if (!wordsByClass.has(word.classType))
        wordsByClass.set(word.classType, []);
      wordsByClass.get(word.classType)?.push(word);
    });

    wordsByClass.forEach((words, clazz) => {
      words.sort((a, b) => {
        if (a.wronglyGuessed !== b.wronglyGuessed)
          return b.wronglyGuessed - a.wronglyGuessed;
        return a.from.localeCompare(b.from);
      });
    });

    return wordsByClass;
  }

  getClassTypeColor(): string {
    switch (this.resultType) {
      case ResultType.RIGHT:
        return "text-success";
      case ResultType.WRONG:
        return "text-danger";
      case ResultType.SKIPPED:
        return "text-warning";
    }
  }

  protected readonly Array = Array;
}
