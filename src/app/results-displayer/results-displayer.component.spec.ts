import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsDisplayerComponent } from './results-displayer.component';

describe('ResultsDisplayerComponent', () => {
  let component: ResultsDisplayerComponent;
  let fixture: ComponentFixture<ResultsDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsDisplayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultsDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
