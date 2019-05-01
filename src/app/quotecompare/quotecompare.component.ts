import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Router, ActivatedRoute} from "@angular/router";
import { ApiService } from '../services/api.service';
import {NgbAccordionConfig,NgbModal, ModalDismissReasons,NgbDatepickerConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../services/ngb-date-fr-parser-formatter";

@Component({
  selector: 'app-quotecompare',
  templateUrl: './quotecompare.component.html',
  styleUrls: ['../../assets/quotecompare/css/main.css'],
  providers: [NgbAccordionConfig,{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
})
export class QuotecompareComponent implements OnInit {

	quoteJson: any;
	showquoteData: any;
	showPremiumData: any;
	countResultPremium: any;
	currDate: any;
	isRenewal:any;
	maufacYear: any[] =[];
	minIDV: any[] =[];
	maxIDV: any[] =[];
	form_premium_type: string;
	premiumJson: any[] = [];
	closeResult: string;
	quoteModifyForm: FormGroup;
	
	constructor(public fb: FormBuilder,protected localStorage: LocalStorage,private router: Router,private  apiService:  ApiService,config: NgbAccordionConfig,private modalService: NgbModal) {
		config.closeOthers = true;
        config.type = 'info';
	}
	
	
	ngOnInit() {
		this.showquoteData=false;
		this.isRenewal=true;
		let now = new Date();
		this.currDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
		var curr_year = new Date().getFullYear();
		var last_year = new Date().getFullYear()-15;
		
		for (let i = curr_year; i > last_year; i--) {
			this.maufacYear.push(i);
		}
		
		this.callPremiumApiService();
		this.generateModifyQuoteForm();
	}
	
	callPremiumApiService()
	{
		this.countResultPremium=0;
		this.showPremiumData=false;
		this.premiumJson=[];
		
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			this.form_premium_type=this.quoteJson.form_premium_type;
			if(this.form_premium_type=="0")
			{
				this.isRenewal=false;
			}
			this.showquoteData=true;
			this.populateModifyQuoteForm();
			this.hdfcGetPremium();
			this.relianceGetPremium();
		});
	}
	
	open(content) {
		this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title',
			//size: 'sm',//
			backdrop: 'static',
			keyboard  : false,
			centered: true}).result.then((result) => {
		  this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}
	
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
		  return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
		  return 'by clicking on a backdrop';
		} else {
		  return  `with: ${reason}`;
		}
	}
	
	/***********************************************************************************************************************/
													//Modify Policy Details
	/***********************************************************************************************************************/
	
	
	
	generateModifyQuoteForm()
	{
		this.quoteModifyForm = this.fb.group({
			modifyIDV: [''],
			modifyManufacMM: [''],
			modifyManufacYY: [''],
			modifyRegistrationDate: [''],
			modifyExpiryDate: [''],
		});
	}
	populateModifyQuoteForm()
	{
		let modifyExpiryDate = {year: this.quoteJson.policy_expiry_date.year, month: this.quoteJson.policy_expiry_date.month, day: this.quoteJson.policy_expiry_date.day};
		this.quoteModifyForm.get('modifyExpiryDate').setValue(modifyExpiryDate);
		
		let modifyRegistrationDate = {year: this.quoteJson.registration_date.year, month: this.quoteJson.registration_date.month, day: this.quoteJson.registration_date.day};
		this.quoteModifyForm.get('modifyRegistrationDate').setValue(modifyRegistrationDate);
		this.quoteModifyForm.get('modifyManufacMM').setValue(this.quoteJson.manufacture_date.month);
		this.quoteModifyForm.get('modifyManufacYY').setValue(this.quoteJson.manufacture_date.year);
		
	}
	quoteModifySubmit()
	{
		let modifyData = this.quoteModifyForm.value;
		this.quoteJson.manufacture_date={year: modifyData.modifyManufacYY, month: modifyData.modifyManufacMM};
		this.quoteJson.policy_expiry_date={year: modifyData.modifyExpiryDate.year, month: modifyData.modifyExpiryDate.month, day:modifyData.modifyExpiryDate.day};
		this.quoteJson.registration_date={year: modifyData.modifyRegistrationDate.year, month: modifyData.modifyRegistrationDate.month, day:modifyData.modifyRegistrationDate.day};
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.callPremiumApiService();
		});
	}
	
	
	
	/***********************************************************************************************************************/
													//Premium Api Service Call
	/***********************************************************************************************************************/
	
	
	
	hdfcGetPremium()
	{
		
		this.quoteJson.serviceUrl="http://uat.gibl.in/tw-php/service.php?action=PREMIUM_REQUEST&PROVIDER_ID=1&PREMIUM_TYPE="+this.form_premium_type;
		let primiumString;
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			console.log(data);
			primiumString=data;
			if(primiumString!="" && typeof primiumString !== 'undefined')
			{
				let premiumJson=JSON.parse(primiumString);
				this.countResultPremium++;
				this.premiumJson.push(premiumJson);
				this.showPremiumData=true;
			}
			
		});
		
	}
	relianceGetPremium()
	{
		
		//this.quoteJson.serviceUrl="http://uat.gibl.in/tw-php/service.php?action=PREMIUM_REQUEST&PROVIDER_ID=1";
		this.quoteJson.serviceUrl="http://uat.gibl.in/tw-php/service.php?action=PREMIUM_REQUEST&PROVIDER_ID=12&PREMIUM_TYPE="+this.form_premium_type;
		let primiumString;
		this.apiService.getPremium(this.quoteJson).subscribe(data => {
			//console.log(data);
			primiumString=data;
			if(primiumString!="" && typeof primiumString !== 'undefined')
			{
				this.countResultPremium++;
				this.premiumJson.push(JSON.parse(primiumString));
				this.showPremiumData=true;
			}
		});
		
	}
	
	
	/***********************************************************************************************************************/
													//Trigger premium button
	/***********************************************************************************************************************/
	
	
	
	premiumTapped(providerID,premiumitem)
	{
		if(providerID=="1")
		{
			this.localStorage.setItem('premiumJson', premiumitem).subscribe(() => {
				this.router.navigate(['/proposal']);
			});
		}
	}
	
	

}
