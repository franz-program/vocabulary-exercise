import { Component } from '@angular/core';
import italianVocabulary from "../../assets/it.json";
import germanVocabulary from "../../assets/de.json";
import {NgForOf, NgIf} from "@angular/common";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import { ButtonModule } from 'primeng/button';
import {Word} from "../../models/word";
import {WordDisplayerComponent} from "../word-displayer/word-displayer.component";
import {ResultType} from "../../models/result";
import {ResultsDisplayerComponent} from "../results-displayer/results-displayer.component";

@Component({
  selector: 'app-words-manager',
  standalone: true,
  imports: [
    NgForOf,
    NgbDropdownModule,
    NgIf,
    ButtonModule,
    WordDisplayerComponent,
    ResultsDisplayerComponent
  ],
  templateUrl: './words-manager.component.html',
  styleUrl: './words-manager.component.css'
})
export class WordsManagerComponent {
  selectedVocabulary: any = undefined;
  selectedDirection: string | undefined = undefined;

  availableClasses: string[] = [];
  selectedClasses: string[] = [];

  availableTags: string[] = [];
  selectedTags: string[] = [];

  startedPracticing: boolean = false;
  finishedPracticing: boolean = false;

  wordsToPractice: Word[] = [];
  currentAttempt: Word | undefined = undefined;

  correctAttempts: Word[] = [];
  wrongAttempts: Word[] = [];
  skippedAttempts: Word[] = [];

  selectDirection(direction: string) {
    this.selectedDirection = direction;
    if(this.selectedDirection === "it->de")
      this.selectedVocabulary = this.italianVocabulary;
    else if(this.selectedDirection === "de->it")
      this.selectedVocabulary = this.germanVocabulary;
    else
      throw new Error("Invalid direction");

    this.updateAvailableClasses();
    this.updateAvailableTags();
  }

  updateAvailableClasses(){
    this.availableClasses = Object.keys(this.selectedVocabulary["classes"]);
    this.selectedClasses = [];
  }

  updateAvailableTags(){
    let tags: Set<string> = new Set();
    for(let clazz of this.selectedClasses)
      this.selectedVocabulary["classes"][clazz]["tags"].forEach((tag: string) => tags.add(tag));
    this.availableTags = Array.from(tags);
    this.selectedTags = this.selectedTags.filter(t => this.availableTags.includes(t));
  }

  toggleSelectedClass(className: string) {
    if(this.selectedClasses.includes(className))
      this.selectedClasses = this.selectedClasses.filter(c => c !== className);
    else
      this.selectedClasses.push(className);
    this.updateAvailableTags();
  }

  toggleSelectedTag(tag: string) {
    if(this.selectedTags.includes(tag))
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    else
      this.selectedTags.push(tag);
    //this.updateAvailableTags();
  }

  startPracticing(){
    this.startedPracticing = true;
    this.fillWordsToPractice();
    this.nextWord();
  }

  fillWordsToPractice(){
    console.log(this.selectedClasses, this.selectedTags);

    for(let selectedClass of this.selectedClasses)
      for(let wordJson of this.selectedVocabulary["classes"][selectedClass]["words"]){
        let classType = selectedClass.endsWith("s") ? selectedClass.slice(0, -1) : selectedClass;
        let word = Word.fromJson(wordJson, classType);
        for(let selectedTag of this.selectedTags)
          if(word.tags.includes(selectedTag)){
            this.wordsToPractice.push(word);
            break;
          }
      }


    //TODO: add sorting
  }

  nextWord(){
    if(this.wordsToPractice.length === 0){
      this.currentAttempt = undefined;
      this.finishedPracticing = true;
      return;
    }
    this.currentAttempt = this.wordsToPractice.pop();
  }

  getWordResult(resultType: ResultType){
    if(this.currentAttempt === undefined)
      throw new Error("No word to evaluate");
    if(resultType === ResultType.CORRECT)
      this.correctAttempts.push(this.currentAttempt);
    else if(resultType === ResultType.SKIPPED)
      this.skippedAttempts.push(this.currentAttempt);
    else if(resultType === ResultType.INCORRECT)
      this.wrongAttempts.push(this.currentAttempt);
    else
      throw new Error("Invalid result type");

    this.nextWord();
  }

  stopPracticing(){
    this.finishedPracticing = true;
  }

  constructor() {
  }

  protected readonly italianVocabulary = italianVocabulary;
  protected readonly germanVocabulary = germanVocabulary;
  protected readonly stop = stop;
}
