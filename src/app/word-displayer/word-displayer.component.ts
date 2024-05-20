import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, HostListener} from '@angular/core';
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
  finalResult: ResultType = ResultType.RIGHT;

  @Output() resultEmitter: EventEmitter<ResultType> = new EventEmitter<ResultType>();

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === "Enter"){
      this.fillUserTranslations();
      for(let i = 0; i < this.userTranslations.length; i++)
        if(this.userTranslations[i].trim() === ""){
          this.focusInput(i);
          return;
        }

      this.checkTranslations();
    }
  }

  ngOnChanges(changes:SimpleChanges){
    this.userTranslations = [];
    this.userResults = [];
    this.attemptDone = false;
    this.solutionsRevealed = false;
    this.finalResult = ResultType.RIGHT;
    this.focusInput(0);
  }

  fillUserTranslations(): void{
    if(this.word === undefined)
      return;

    while(this.userTranslations.length < this.word.to.length)
      this.userTranslations.push("");
    this.userTranslations = this.userTranslations
      .map(translation => {
        if(translation === undefined)
          return "";
        return translation.trim();
      });
  }

  focusInput(index: number){
    const firstInput = document.getElementById("translation-input-" + index);
    if(firstInput !== null)
      firstInput.focus();
  }

  checkTranslations() {
    if(this.word === undefined)
      return;
    this.attemptDone = true;
    let translations = Object.assign([], this.word.to);
    let mistakes = 0;
    this.fillUserTranslations();
    for(let i = 0; i < this.userTranslations.length; i++)
      if(translations.includes(this.userTranslations[i])){
        this.userResults[i] = true;
        translations.filter(translation => translation !== this.userTranslations[i]);
      } else{
        this.userResults[i] = false;
        mistakes++;
        this.finalResult = ResultType.WRONG;
      }

    if(mistakes === 0)
      setTimeout(() => this.resultEmitter.emit(this.finalResult), 600);
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
