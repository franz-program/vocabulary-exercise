import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {WordsManagerComponent} from "./words-manager/words-manager.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WordsManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vocabulary-exercise';
}
