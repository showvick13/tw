import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalconfirmationComponent } from './proposalconfirmation.component';

describe('ProposalconfirmationComponent', () => {
  let component: ProposalconfirmationComponent;
  let fixture: ComponentFixture<ProposalconfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalconfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalconfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
