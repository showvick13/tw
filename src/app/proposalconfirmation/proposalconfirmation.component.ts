import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-proposalconfirmation',
  templateUrl: './proposalconfirmation.component.html',
  styleUrls: ['../../assets/proposalconfirmation/css/style.css','../../assets/proposalconfirmation/css/main.css']
})
export class ProposalconfirmationComponent implements OnInit {

	quoteJson: any;
	premiumJson: any;
	proposalJson: any;
	personalDetailJson: any;
	carDetailJson: any;
	nomineeDetailJson: any;
	addressDetailJson: any;
	proposalConfirmationJson: any= {};
	showQuotedata: any;
	showPremiumdata: any;
	showProposaldata: any;
	showPaymentdata: any;
	paymentUrl: any;
	custId: any;
	
	constructor(public formBuilder: FormBuilder, protected localStorage: LocalStorage, private router: Router, private  apiService:  ApiService) { 
		this.showQuotedata=false;
		this.showPremiumdata=false;
		this.showProposaldata=false;
		this.showPaymentdata=false;
		this.paymentUrl="http://202.191.196.210/uat/onlineproducts/twOnlinetariff/TIM.aspx";
		
		this.getQuoteJson();
		
	}
	getQuoteJson()
	{
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			this.showQuotedata=true;
			//console.log(this.quoteJson);
			this.proposalConfirmationJson.quoteJson=this.quoteJson;
			this.getPremiumJson();
		});
	}
	getPremiumJson()
	{
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			var premium_json=data;
			this.premiumJson=premium_json;
			this.showPremiumdata=true;
			this.getProposalJson();
			this.proposalConfirmationJson.premiumJson=this.premiumJson;
			//console.log(this.premiumJson);
		});
	}
	getProposalJson()
	{
		this.localStorage.getItem('proposalJson').subscribe((data) => {
			this.proposalJson=data;
			this.personalDetailJson=this.proposalJson.personalDetailForm;
			this.carDetailJson=this.proposalJson.carDetailForm;
			this.nomineeDetailJson=this.proposalJson.nomineeDetailForm;
			this.addressDetailJson=this.proposalJson.addressDetailForm;
			this.showProposaldata=true;
			this.proposalConfirmationJson.proposalJson=this.proposalJson;
			this.createProposal();
			//console.log(this.proposalJson);
		});
	}
	createProposal()
	{
		//this.proposalConfirmationJson.serviceUrl="http://uat.gibl.in/tw-php/service.php?action=CREATE_PROPOSAL&PROVIDER_ID=1";
		this.proposalConfirmationJson.serviceUrl="http://uat.gibl.in/tw-php/service.php?action=CREATE_PROPOSAL&PROVIDER_ID="+this.premiumJson.PROVIDER_ID+"&PREMIUM_TYPE="+this.premiumJson.premium_type;
		
		this.apiService.createProposal(this.proposalConfirmationJson).subscribe(data => {
			//console.log(data);
			this.custId=data;
			this.showPaymentdata=true;
		});
	}
	paymentFormSubmit(form: any, e: any): void
	{
		e.target.submit();
	}
	ngOnInit() {
	}

}
