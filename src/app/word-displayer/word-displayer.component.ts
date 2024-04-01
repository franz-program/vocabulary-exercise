import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Word} from "../../models/word";
import {NgForOf, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ResultType} from "../../models/result";

@Component({
  selector: 'app-word-displayer',
  standalone: true,
  imports: [
    NgForOf,
    ButtonModule,
    NgIf,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './word-displayer.component.html',
  styleUrl: './word-displayer.component.css'
})
export class WordDisplayerComponent implements OnChanges {
  @Input() word: Word | undefined;
  userTranslations: string[] = [];
  userResults: boolean[] = [];
  attemptDone: boolean = false;
  solutionsRevealed: boolean = false;
  finalResult: ResultType = ResultType.CORRECT;

  @Output() resultEmitter: EventEmitter<ResultType> = new EventEmitter<ResultType>();

  ngOnChanges(changes:SimpleChanges){
    this.userTranslations = [];
    this.userResults = [];
    this.attemptDone = false;
    this.solutionsRevealed = false;
    this.finalResult = ResultType.CORRECT;
  }

  checkTranslations() {
    if(this.word === undefined)
      return;
    this.attemptDone = true;
    let translations = Object.assign([], this.word.to);
    while(this.userTranslations.length < this.word.to.length)
      this.userTranslations.push("");
    for(let i = 0; i < this.userTranslations.length; i++)
      if(translations.includes(this.userTranslations[i])){
        this.userResults[i] = true;
        translations.filter(translation => translation !== this.userTranslations[i]);
      } else{
        this.userResults[i] = false;
        this.finalResult = ResultType.INCORRECT;
      }
  }

  revealSolutions(){
    if(this.word === undefined)
      return;
    this.solutionsRevealed = true;
    this.userTranslations = this.userTranslations.map(translation => translation.trim());
    while(this.userTranslations.length < this.word.to.length)
      this.userTranslations.push("");

    let correctUserTranslationsSet: Set<string> = new Set();
    for(let userTranslation of this.userTranslations)
      if(this.word.to.includes(userTranslation))
        correctUserTranslationsSet.add(userTranslation);
    let correctUserTranslations = Array.from(correctUserTranslationsSet);
    let missingTranslations = this.word.to.filter(translation => !correctUserTranslations.includes(translation));

    for(let i = 0; i < this.userTranslations.length; i++)
      if(correctUserTranslationsSet.has(this.userTranslations[i]))
        correctUserTranslationsSet.delete(this.userTranslations[i]);
      else { // @ts-ignore
          this.userTranslations[i] = missingTranslations.pop();
        }
  }

  protected readonly ResultType = ResultType;
}
