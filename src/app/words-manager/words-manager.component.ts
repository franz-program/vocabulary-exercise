import { Component } from '@angular/core';
import italianVocabulary from "../../assets/it.json";
import germanVocabulary from "../../assets/de.json";
import {NgForOf, NgIf} from "@angular/common";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import { ButtonModule } from 'primeng/button';
import {Word} from "../../models/word";
import {WordDisplayerComponent} from "../word-displayer/word-displayer.component";

@Component({
  selector: 'app-words-manager',
  standalone: true,
  imports: [
    NgForOf,
    NgbDropdownModule,
    NgIf,
    ButtonModule,
    WordDisplayerComponent
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

  wordsToPractice: Word[] = [];
  currentWord: Word | undefined = undefined;


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
    this.availableTags.push("<untagged>");
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
    this.updateAvailableTags();
  }

  startPracticing(){
    this.startedPracticing = true;
    this.fillWordsToPractice();
    this.nextWord();
  }

  fillWordsToPractice(){
    for(let clazz of this.selectedClasses)
      for(let word of this.selectedVocabulary["classes"][clazz]["words"])
        this.wordsToPractice.push(Word.fromJson(word));

    //TODO: add sorting
  }

  nextWord(){
    if(this.wordsToPractice.length === 0){
      this.currentWord = undefined;
      return;
    }
    this.currentWord = this.wordsToPractice.pop();
  }

  constructor() {
  }

  protected readonly italianVocabulary = italianVocabulary;
  protected readonly germanVocabulary = germanVocabulary;
}
