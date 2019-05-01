import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotecompareComponent } from './quotecompare.component';

describe('QuotecompareComponent', () => {
  let component: QuotecompareComponent;
  let fixture: ComponentFixture<QuotecompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotecompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotecompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
