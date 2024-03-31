import {Component, Input} from '@angular/core';
import {Word} from "../../models/word";
import {NgForOf, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";

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
export class WordDisplayerComponent {
  @Input() word: Word | undefined;
  solutionsRevealed: boolean = false;
  userTranslations: string[] = [];
  userResults: boolean[] = [];

  checkTranslations() {
    if(this.word === undefined)
      return;
    let translations = Object.assign([], this.word.to);
    for(let i = 0; i < this.userTranslations.length; i++)
      if(translations.includes(this.userTranslations[i])){
        this.userResults[i] = true;
        translations.splice(i, 1);
      } else
        this.userResults[i] = false;

  }

  revealSolutions(){
    if(this.word === undefined)
      return;
    this.userTranslations = Object.assign([], this.word.to);
  }

  loadNext(){

  }
}
