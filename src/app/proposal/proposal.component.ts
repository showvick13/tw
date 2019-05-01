import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Router, ActivatedRoute} from "@angular/router";
import statejson from './state_master.json';
import cityjson from './city_master.json';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['../../assets/proposal/css/style.css','../../assets/proposal/css/main.css'],
  //encapsulation : ViewEncapsulation.None
})
export class ProposalComponent implements OnInit {

	stateJson: any;
	cityJson: any;
	filtercityJson: any;
	quoteJson: any;
	premiumJson: any;
	proposalJson: any;
	showQuotedata: any;
	showPremiumdata: any;
	personalDetailTab: any;
	carDetailTab: any;
	nomineeDetailTab: any;
	addressDetailTab: any;
	personalDetailComplete: any;
	carDetailComplete: any;
	nomineeDetailComplete: any;
	addressDetailComplete: any;
	modifyRtoCode: any;
	custStateLabel: any;
	custCityLabel: any;
	
	custDOBDD : any[] =[];
	custDOBMM : any[] =[];
	custDOBYY : any[] =[];
	
	constructor(public formBuilder: FormBuilder,protected localStorage: LocalStorage,private router: Router) {
		
		this.personalDetailTab=true;
		this.carDetailTab=false;
		this.nomineeDetailTab=false;
		this.addressDetailTab=false;
		
		this.activepersonalDetail(); //To active personal detail Tab
		
		for (let i = 1; i <= 31; i++) {
			if(i<10)
			{
				var dd="0"+i.toString();
			}
			else
			{
				var dd=i.toString();
			}
			this.custDOBDD.push(dd);
		}
		for (let i = 1; i <= 12; i++) {
			if(i<10)
			{
				var mm="0"+i.toString();
			}
			else
			{
				var mm=i.toString();
			}
			this.custDOBMM.push(mm);
		}
		
		var curr_adult = new Date().getFullYear()-18;
		var last_adult = new Date().getFullYear()-99;
		
		for (let i = curr_adult; i > last_adult; i--) {
			this.custDOBYY.push(i);
		}
		
		this.showQuotedata=false;
		this.showPremiumdata=false;
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			this.showQuotedata=true;
			this.modifyRtoCode=this.quoteJson.rto_code.replace('-', '');
			console.log(this.quoteJson);
			this.setFormDetails(); // Use to set Form details values
			
		});
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			var premium_json=data;
			this.premiumJson=premium_json;
			this.showPremiumdata=true;
			console.log(this.premiumJson);
		});
	}
	
	getCity(event)
	{
		this.custStateLabel = event.target['options'][event.target['options'].selectedIndex].text;
		
		var custState=event.target.value;
		var filter_city=[];
		this.cityJson.forEach(el => {
			if(el.state_id==custState)
			{
				filter_city.push(el);
			}
		});
		this.filtercityJson=filter_city;
	}
	
	cityChanged(event)
	{
		this.custCityLabel = event.target['options'][event.target['options'].selectedIndex].text;
	}
	setFormDetails()
	{
		var custPhone=this.quoteJson.cust_phone;
		var custEmail=this.quoteJson.cust_email;
		
		this.personalDetailForm.patchValue({"custPhone":custPhone,"custEmail":custEmail});
		this.carDetailForm.patchValue({"rtoCode":this.modifyRtoCode});
		
	}
	registerForm: FormGroup;
	ngOnInit() {
		this.stateJson=statejson;
		this.cityJson=cityjson;
		//console.log(this.stateJson);
		
		/*******************************************************Register all forms*********************************************/
		this.registerForm = this.formBuilder.group({
			personalDetailForm: this.formBuilder.group({
				custName: ['Showvick Nath',[Validators.required]],
				custPhone: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
				custEmail: ['',[Validators.required,Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
				custPancard: ['AAAPL1234C',[Validators.required,Validators.pattern(/^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/)]],
				custDOBDD: ['',Validators.required],
				custDOBMM: ['',Validators.required],
				custDOBYY: ['',Validators.required],
			}),
			carDetailForm: this.formBuilder.group({
				rtoCode: ['WB31',[Validators.required]],
				rtoregNumber: ['AB1234',[Validators.required]],
				engineNo: ['ABC123',[Validators.required,Validators.minLength(6)]],
				chassisNo: ['ABC123',[Validators.required,Validators.minLength(6)]],
			}),
			nomineeDetailForm: this.formBuilder.group({
				nomineeName: ['Showvick Nath',[Validators.required]],
				nomineeAge: ['51',[Validators.required]],
				nomineeRelation: ['Father',[Validators.required]]
			}),
			addressDetailForm: this.formBuilder.group({
				custAddress: ['',[Validators.required]],
				custState: ['',[Validators.required]],
				custCity: ['',[Validators.required]],
				custPincode: ['',[Validators.required,Validators.pattern(/^[1-9][0-9]{5}$/)]],
				custStateLabel: [''],
				custCityLabel: [''],
			})
		});
		/*******************************************************Register all forms*********************************************/
	}
	personalDetailSubmitted: boolean = false;
	carDetailSubmitted: boolean = false;
	nomineeDetailSubmitted: boolean = false;
	addressDetailSubmitted: boolean = false;
	
	get f() { return (<FormGroup>this.registerForm.get('personalDetailForm')).controls; }
	get c() { return (<FormGroup>this.registerForm.get('carDetailForm')).controls; }
	get n() { return (<FormGroup>this.registerForm.get('nomineeDetailForm')).controls; }
	get a() { return (<FormGroup>this.registerForm.get('addressDetailForm')).controls; }

	get personalDetailForm() {
		return this.registerForm.get('personalDetailForm');
	}
	get carDetailForm() {
		return this.registerForm.get('carDetailForm');
	}
	get nomineeDetailForm() {
		return this.registerForm.get('nomineeDetailForm');
	}
	get addressDetailForm() {
		return this.registerForm.get('addressDetailForm');
	}

	personalDetailSubmit() {
		this.personalDetailSubmitted = true;
		if (this.personalDetailForm.invalid) {
			return;
		}
		else
		{
			this.activecarDetail(); //To active car detail Tab
			this.personalDetailComplete=true;
		}
	}
	carDetailSubmit() {
		this.carDetailSubmitted = true;
		if (this.carDetailForm.invalid) {
			return;
		}
		else
		{
			this.activenomineeDetail(); //To active nominee detail Tab
			this.carDetailComplete=true;
		}
	}
	nomineeDetailSubmit() {
		this.nomineeDetailSubmitted = true;
		if (this.nomineeDetailForm.invalid) {
		  return;
		}
		else
		{
			this.activeaddressDetail(); //To active address detail Tab
			this.nomineeDetailComplete=true;
		}
	}
	addressDetailSubmit() {
		this.addressDetailSubmitted = true;
		if (this.addressDetailForm.invalid) {
		  return;
		}
		else
		{
			this.addressDetailForm.patchValue({"custCityLabel":this.custCityLabel,"custStateLabel":this.custStateLabel});
			this.addressDetailComplete=true;
			this.localStorage.setItem('proposalJson', this.registerForm.value).subscribe(() => {
				console.log(this.registerForm.value);
				this.router.navigate(['/proposal-confirmation']);
			});
		}
	}
	activepersonalDetail()
	{
		this.personalDetailTab=true;
		this.carDetailTab=false;
		this.nomineeDetailTab=false;
		this.addressDetailTab=false;
	}
	activecarDetail()
	{
		this.personalDetailTab=false;
		this.carDetailTab=true;
		this.nomineeDetailTab=false;
		this.addressDetailTab=false;
	}
	activenomineeDetail()
	{
		this.personalDetailTab=false;
		this.carDetailTab=false;
		this.nomineeDetailTab=true;
		this.addressDetailTab=false;
	}
	activeaddressDetail()
	{
		this.personalDetailTab=false;
		this.carDetailTab=false;
		this.nomineeDetailTab=false;
		this.addressDetailTab=true;
	}

}
