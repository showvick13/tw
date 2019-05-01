import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuoteComponent } from './quote/quote.component';
import { Select2Module } from 'ng2-select2';
import { ReactiveFormsModule } from '@angular/forms';
import { QuotecompareComponent } from './quotecompare/quotecompare.component';
import { HttpClientModule } from '@angular/common/http';
import { ProposalComponent } from './proposal/proposal.component';
import { ProposalconfirmationComponent } from './proposalconfirmation/proposalconfirmation.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms'; //gggggfrgf 

@NgModule({
  declarations: [
    AppComponent,
    QuoteComponent,
    QuotecompareComponent,
    ProposalComponent,
    ProposalconfirmationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	Select2Module,
	NgbModule,
	FormsModule,
	HttpClientModule,
	ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
