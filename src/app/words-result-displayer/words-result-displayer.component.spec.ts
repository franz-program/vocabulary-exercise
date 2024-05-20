import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsResultDisplayerComponent } from './words-result-displayer.component';

describe('WordsResultDisplayerComponent', () => {
  let component: WordsResultDisplayerComponent;
  let fixture: ComponentFixture<WordsResultDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsResultDisplayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordsResultDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
