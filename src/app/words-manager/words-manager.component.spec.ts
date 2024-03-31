import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsManagerComponent } from './words-manager.component';

describe('WordsManagerComponent', () => {
  let component: WordsManagerComponent;
  let fixture: ComponentFixture<WordsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
