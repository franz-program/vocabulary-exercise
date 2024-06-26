import {Component} from '@angular/core';
import italianVocabulary from "../../assets/it-de.json";
import germanVocabulary from "../../assets/de-it.json";
import fullTagsHierarchy from "../../assets/tags-hierarchies.json";
import {NgForOf, NgIf} from "@angular/common";
import {
  NgbAccordionBody,
  NgbAccordionButton, NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbDropdownModule
} from "@ng-bootstrap/ng-bootstrap";
import { ButtonModule } from 'primeng/button';
import {Word} from "../../models/word";
import {WordDisplayerComponent} from "../word-displayer/word-displayer.component";
import {ResultType} from "../../models/result";
import {ResultsDisplayerComponent} from "../results-displayer/results-displayer.component";
import {FormsModule} from "@angular/forms";
import {TagsHierarchy} from "../../models/tagsHierarchy";

const wordsOrdering = ["newest to oldest", "newest with some randomness", "oldest to newest", "completely random"];

@Component({
  selector: 'app-words-manager',
  standalone: true,
  imports: [
    NgForOf,
    NgbDropdownModule,
    NgIf,
    ButtonModule,
    WordDisplayerComponent,
    ResultsDisplayerComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionBody,
    FormsModule
  ],
  templateUrl: './words-manager.component.html',
  styleUrl: './words-manager.component.css'
})
export class WordsManagerComponent{
  selectedVocabulary: any = undefined;
  selectedDirection: string | undefined = undefined;

  selectedOrdering: string = wordsOrdering[0];

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

  availableTagsHierarchy: TagsHierarchy = new TagsHierarchy();

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
    this.availableTags.sort();
    this.selectedTags = this.selectedTags.filter(t => this.availableTags.includes(t));

    //update hierarchy
    this.availableTagsHierarchy = new TagsHierarchy();
    for(let tag of this.availableTags){
      let key = this.fullTagsHierarchy.getTagGroup(tag);
      this.availableTagsHierarchy.addToHierarchy(key, [tag]);
    }
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
  }

  startWithAll(){
    this.selectedClasses = this.availableClasses;
    this.updateAvailableTags();
    this.selectedTags = this.availableTags;
    this.startPracticing();
  }

  startPracticing(){
    this.startedPracticing = true;
    this.fillWordsToPractice();
    this.nextWord();
  }

  fillWordsToPractice(){
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

    this.sortWords();
  }

  sortWords(){
    if(this.selectedOrdering === wordsOrdering[0])
      this.wordsToPractice.sort((a, b) => b.insertedAt - a.insertedAt);
    else if(this.selectedOrdering === wordsOrdering[1]){
      let minInserted: number = Math.min(...this.wordsToPractice.map(word => word.insertedAt));
      let maxInserted: number = Math.max(...this.wordsToPractice.map(word => word.insertedAt));
      if (maxInserted === minInserted)
        maxInserted = minInserted + 1;

      this.wordsToPractice.forEach(word => {
        word.insertedAt = ((word.insertedAt - minInserted) / (maxInserted - minInserted))
          * 6 + 2;
        word.insertedAt = (Math.random()/3 + 1.0) * word.insertedAt;
      });

      this.wordsToPractice.sort((a, b) => b.insertedAt - a.insertedAt);
    } else if(this.selectedOrdering === wordsOrdering[2])
      this.wordsToPractice.sort((a, b) => a.insertedAt - b.insertedAt);
    else
      this.wordsToPractice = this.wordsToPractice.map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
  }

  nextWord(){
    if(this.wordsToPractice.length === 0){
      this.currentAttempt = undefined;
      this.finishedPracticing = true;
      return;
    }
    this.currentAttempt = this.wordsToPractice.shift();
  }

  getWordResult(resultType: ResultType){
    if(this.currentAttempt === undefined)
      throw new Error("No word to evaluate");
    if(resultType === ResultType.RIGHT)
      this.correctAttempts.push(this.currentAttempt);
    else if(resultType === ResultType.SKIPPED)
      this.skippedAttempts.push(this.currentAttempt);
    else if(resultType === ResultType.WRONG) {
      if(this.currentAttempt.wronglyGuessed === 0)
        this.wrongAttempts.push(this.currentAttempt);
      this.currentAttempt.wronglyGuessed++;
      let insertionIndex = Math.random() * 10 + 10;
      this.wordsToPractice.splice(insertionIndex, 0, this.currentAttempt);
    } else
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
  protected readonly wordsOrdering = wordsOrdering;
  protected readonly fullTagsHierarchy: TagsHierarchy = TagsHierarchy.fromObject(fullTagsHierarchy);
}
