import { Component } from '@angular/core';
import it from "../../assets/it.json";
import de from "../../assets/de.json";
import {NgForOf} from "@angular/common";


@Component({
  selector: 'app-words-manager',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './words-manager.component.html',
  styleUrl: './words-manager.component.css'
})
export class WordsManagerComponent {
  classes: string[] = [];
  selectedLanguage = "it";

  constructor() {
    this.classes = Object.keys(it["classes"]);
    console.log(this.classes);
  }

}
