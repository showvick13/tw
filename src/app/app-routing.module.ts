import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuoteComponent } from './quote/quote.component';
import { QuotecompareComponent } from './quotecompare/quotecompare.component';
import { ProposalComponent } from './proposal/proposal.component';
import { ProposalconfirmationComponent } from './proposalconfirmation/proposalconfirmation.component';

const routes: Routes = [
{path: '', component: QuoteComponent},
{path: 'quote-compare', component: QuotecompareComponent},
{path: 'proposal', component: ProposalComponent},
{path: 'proposal-confirmation', component: ProposalconfirmationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
