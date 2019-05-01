import { Component, OnInit,ViewEncapsulation,ViewChild,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import {Router, ActivatedRoute} from "@angular/router";
import { Select2OptionData } from 'ng2-select2';
import { NgbCarouselConfig,NgbCarousel,NgbModal, ModalDismissReasons,NgbDatepickerConfig, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../services/ngb-date-fr-parser-formatter";
import carjson from './twowheeler.json';
import rtojson from './rto_master.json';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['../../assets/quote/css/style.css','../../assets/quote/css/main.css'],
  providers: [NgbCarouselConfig,{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
  //encapsulation : ViewEncapsulation.None
})
export class QuoteComponent implements OnInit {
	
	@ViewChild('myCarousel') myCarousel: NgbCarousel;
	public exampleData: Array<Select2OptionData>;
	brandText: string = 'Brand';
	modelText: string = 'Model';
	fuelText: string = 'Fuel';
	variantText: string = 'Variant';
	registrationText: string = 'Registration';
	bikeText: string = '';
	
	form_brand: string = "0";
	form_model: string = "0";
	form_fuel: string = "0";
	form_variant: string = "0";
	form_rto_id: string = "0";
	form_rto_code: string = "0";
	form_reg_year: string = "2019";
	form_car: string = "0";
	form_premium_type: string = "1";
	
	twJson: any;
	rtoJson: any;
	quoteJson: any;
	totalBrandList: any;
	topBrandList: any;
	totalModelList: any;
	topModelList: any;
	totalFuelList: any;
	totalVariantList: any;
	topVariantList: any;
	totalRTOList: any;
	quoteSubmitted: any;
	quoteForm: FormGroup;
	screenHeight:any;
    screenWidth:any;
    isMobile:any;
    isRenewal:any;
	closeResult: string;
	currDate: any;
	regYearDropdown: any[] =[];
	
	constructor(
	public fb: FormBuilder,
	protected localStorage: LocalStorage,
	private router: Router,
	private route:ActivatedRoute,
	config: NgbCarouselConfig,
	private modalService: NgbModal
	){
		this.getScreenSize();

	}
	
	ngOnInit() {
		let now = new Date();
		this.currDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
		
		var curr_year = new Date().getFullYear();
		var last_year = new Date().getFullYear()-15;
		for (let i = curr_year; i > last_year; i--) {
			this.regYearDropdown.push(i);
		}
		this.quoteSubmitted=false;
		this.isMobile=false;
		this.isRenewal=true;
		this.rtoJson=rtojson;
		this.twJson=carjson;
		this.get_brand();
		this.generateQuoteForm();
		this.get_top_brand();
		this.get_rto_list();
		
		if (this.screenWidth < 767) {
			this.isMobile=true;
		}

	}
	
	/*********************************************************************/
				//Open popup for mobile version
	/*********************************************************************/
	
	open(content) {
		this.modalService.open(content, {
			ariaLabelledBy: 'modal-basic-title',
			size: 'sm',
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
	
	@HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenWidth = window.innerWidth;
	}
	
	/*********************************************************************/
				//On change premium type radio button new/remew
	/*********************************************************************/
	
	premiumType(type)
	{
		this.form_premium_type=type;
		
		if(type=="0")
		{
			this.isRenewal=false;
			let now = new Date();
			let policyExpiryDate = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
			
			this.quoteForm.get('policyExpiryDate').setValue(policyExpiryDate);
			this.quoteForm.patchValue({"regYear":"2019"});
		}
		else
		{
			this.isRenewal=true;
			this.quoteForm.get('policyExpiryDate').setValue("");
			this.quoteForm.patchValue({"regYear":""});
		}
	}
	
	/*****************************************************/
				//Generate quote form
	/*****************************************************/
	
	generateQuoteForm()
	{
		
		this.quoteForm = this.fb.group({
			custPhone: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
			custEmail: ['',[Validators.required,Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
			policyExpiryDate: ['',[Validators.required]],
			regYear: ['',[Validators.required]],
			lastClaimedYear: ['0',[Validators.required]],
		});
	}
	
	get f() { return this.quoteForm.controls; }
	goToTab(id)
	{
		this.myCarousel.select(id);
	}
	
	/*****************************************************/
				//Edit form value
	/*****************************************************/
	
	editDetail()
	{
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			var quoteJson=data;
			this.brandChanged(quoteJson.bike_id);
			this.premiumType(quoteJson.form_premium_type);
		});
		
	}
	
	
	
	/*****************************************************/
				//Get Brand List
	/*****************************************************/
	get_brand()
	{
		var totalBrandListFilter=[];
		var output: any;
		output={"id":0,"text":"Not in the list? Find your car's brand here"};
		totalBrandListFilter.push(output);
		this.twJson.forEach(el => {
			output={"id":el.id,"text":el.full_name};
			totalBrandListFilter.push(output);
		});
		this.totalBrandList=totalBrandListFilter;
		
		this.route.queryParams.subscribe(params => {
			if(params.edit=="Y")
			{
				this.editDetail();
			}
		});
	}
	
	
	
	/*****************************************************/
				//Get 12 top brand or manufacturer
	/*****************************************************/
	
	get_top_brand()
	{
		var filter_brand=[];
		this.twJson.forEach(el => {
			if(el.is_popular=='1')
			{
				filter_brand.push(el);
			}
		});
		this.topBrandList=filter_brand;
		//console.log(this.topBrandList);
	}
	
	/*****************************************************/
				//Get model list
	/*****************************************************/
	
	
	get_model(brand_val)
	{
		var filter_model=[];
		this.twJson.forEach(el => {
			if(el.brand_code==brand_val)
			{
				filter_model[el.model_code]=el;
			}
		});
		
		var finalModelList=[];
		var output: any;
		output={"id":0,"text":"Not in the list? Find your car's model here"};
		finalModelList.push(output);
		Object.keys(filter_model).forEach(function (key) {
			var el=filter_model[key];
			output={"id":el.model_code,"text":el.model_name};
			finalModelList.push(output);
		});
		this.totalModelList=finalModelList;
	}
	
	
	/*****************************************************/
				//Get top 12 model list
	/*****************************************************/
	
	
	get_top_model(brand_code)
	{
		var filter_model=[];
		
		this.twJson.forEach(el => {
			if(el.brand_code==brand_code )
			{
				filter_model[el.model_code]=el;
			}
			
		});
		
		var finaltopModelList=[];
		var i=1;
		Object.keys(filter_model).forEach(function (key) {
			if(i<=12)
			{
				var el=filter_model[key];
				finaltopModelList.push(el);
				i++;
			}
		});
		this.topModelList=finaltopModelList;
	}
	
	/*****************************************************/
				//Get variant List
	/*****************************************************/
	
	get_variant(model_code,fuel_type)
	{
		var finalVariantList=[];
		var output: any;
		output={"id":0,"text":"Not in the list? Find your car's variant here"};
		finalVariantList.push(output);
		
		this.twJson.forEach(el => {
			if(el.model_code==model_code && el.fuel_type==fuel_type)
			{
				output={"id":el.id,"text":el.variant_name};
				finalVariantList.push(output);
			}
		});
		this.totalVariantList=finalVariantList;
		//console.log(this.totalVariantList);
	}
	
	/*****************************************************/
				//Get top 12 variant
	/*****************************************************/
	
	get_top_variant(model_code,fuel_type)
	{
		var filter_variant=[];
		this.twJson.forEach(el => {
			if(el.model_code==model_code && el.fuel_type==fuel_type)
			{
				filter_variant.push(el);
			}
		});
		var final_filter_variant=[];
		var i=1;
		filter_variant.forEach(el => {
			if(i<=12)
			{
				final_filter_variant.push(el);
				i++;
			}
		});
		this.topVariantList=final_filter_variant;
		//console.log(this.topVariantList);
	}
	
	/*****************************************************/
				//Get RTO List
	/*****************************************************/
	
	get_rto_list()
	{
		
		var totalRTOListFilter=[];
		var output: any;
		output={"id":0,"text":"Select RTO (e.g. MH02 or Mumbai)"};
		totalRTOListFilter.push(output);
		this.rtoJson.forEach(el => {
			output={"id":el.id,"text":el.rto_code};
			totalRTOListFilter.push(output);
		});
		this.totalRTOList=totalRTOListFilter;
		console.log(this.totalRTOList);
	}
	
	
	/*****************************************************/
				//Change Brand List
	/*****************************************************/
	brandChanged(car_id)
	{
		let selectedSlide="5";
		this.myCarousel.select(selectedSlide);
		var filter_tw_list : any;
		this.twJson.forEach(el => {
			if(el.id==car_id)
			{
				filter_tw_list=el;
			}
		});
		this.bikeText= filter_tw_list.full_name;
		this.brandText= filter_tw_list.brand_name;
		this.modelText= filter_tw_list.model_name;
		this.fuelText= filter_tw_list.fuel_type_text;
		this.variantText= filter_tw_list.variant_name;
		this.registrationText= 'Registration';
		
		this.form_brand = filter_tw_list.brand_code;
		this.form_model = filter_tw_list.model_code;
		this.form_fuel = filter_tw_list.fuel_type;
		this.form_variant = filter_tw_list.variant_code;
		this.form_rto_id = "0";
		this.form_rto_code = "0";
		this.form_car = filter_tw_list.id;
		
		this.get_model(this.form_brand);
		this.get_top_model(this.form_brand);		
		this.get_variant(this.form_model,this.form_fuel);
		this.get_top_variant(this.form_model,this.form_fuel);
		this.get_fuel(this.form_model);
	}
	/*****************************************************/
				//Change top brand 
	/*****************************************************/
	
	brandTapped(event,brand_text,brand_val)
	{
		if(brand_val!="0" && typeof brand_val !== 'undefined' )
		{
			var selectedSlide="2";
			this.myCarousel.select(selectedSlide);
			this.brandText= brand_text;
			this.modelText= 'Model';
			this.fuelText= 'Fuel';
			this.variantText= 'Variant';
			this.registrationText= 'Registration';
			
			this.form_brand = brand_val;
			this.form_model = "0";
			this.form_fuel = "0";
			this.form_variant = "0";
			this.form_rto_id = "0";
			this.form_rto_code = "0";
			this.form_car = "0";
			
			this.get_model(brand_val);
			this.get_top_model(brand_val);
		}
		
		
	}
	
	
	
	
	/*****************************************************/
				//Change model value
	/*****************************************************/
	modelTapped(event,model_text,model_val)
	{
		
		if(model_val!="0" && typeof model_val !== 'undefined' )
		{
			var selectedSlide="3";
			this.myCarousel.select(selectedSlide);
			this.get_fuel(model_val);
			if (this.screenWidth < 767) 
			{
				this.form_model = model_val;
				this.form_fuel = "0";
				this.form_variant = "0";
				this.form_rto_id = "0";
				this.form_rto_code = "0";
				this.form_car = "0";
				
				this.modelText= model_text;
				this.fuelText= '';
				this.variantText= '';
				this.registrationText= '';
				
				
			}
			else
			{
				this.form_model = model_val;
				this.form_fuel = "0";
				this.form_variant = "0";
				this.form_rto_id = "0";
				this.form_rto_code = "0";
				this.form_car = "0";
				
				this.modelText= model_text;
				this.fuelText= 'Fuel';
				this.variantText= 'Variant';
				this.registrationText= 'Registration';
			}
		}
	}
	/*****************************************************/
				//Get Fuel List
	/*****************************************************/
	get_fuel(model_code)
	{
		var filter_fuel=[];
		this.twJson.forEach(el => {
			if(el.model_code==model_code)
			{
				filter_fuel[el.fuel_type]=el;
			}
		});
		var finalFilterFuel=[];
		Object.keys(filter_fuel).forEach(function (key) {
			var el=filter_fuel[key];
			if(key=="P")
			{
				el.fuel_logo="gasoline.png";
			}
			if(key=="D")
			{
				el.fuel_logo="gas-station.png";
			}
			if(key=="E")
			{
				el.fuel_logo="electric-station.png";
			}
			finalFilterFuel.push(el);
		});
		this.totalFuelList=finalFilterFuel;
		console.log(this.totalFuelList);
	}
	
	/*****************************************************/
				//Change Fuel value
	/*****************************************************/
	
	fuelTapped(event,fuel_type_text,fuel_type,model_code)
	{
		var selectedSlide="4";
		this.myCarousel.select(selectedSlide);
		//$('#model .main-tab div').css("margin-left", "12px");
		this.get_variant(model_code,fuel_type);
		this.get_top_variant(model_code,fuel_type);
		
		this.form_fuel = fuel_type;
		this.form_variant = "0";
		this.form_rto_id = "0";
		this.form_rto_code = "0";
		this.form_car = "0";
		
		this.fuelText= fuel_type_text;
		this.variantText= 'Variant';
		this.registrationText= 'Registration';
		
		
	}
	
	
	
	/*****************************************************/
				//Change Variant List
	/*****************************************************/
	
	variantTapped(event,car_id)
	{
		if(car_id!="0" && typeof car_id !== 'undefined' )
		{
			var selectedSlide="5";
			this.myCarousel.select(selectedSlide);
			this.brandChanged(car_id);
		}
	}
	
	
	/*****************************************************/
				//Change RTO List
	/*****************************************************/
	rtoTapped(event,rto_code,rto_id)
	{
		this.form_rto_id = rto_id;
		this.form_rto_code = rto_code;
		if(rto_id!="0" && typeof rto_id !== 'undefined' && this.quoteForm.value.regYear!="")
		{
			var selectedSlide="6";
			this.myCarousel.select(selectedSlide);
			
		}
	}
	
	/*****************************************************/
				//Change registration year Dropdown
	/*****************************************************/
	
	regYearTapped(event,regYear)
	{
		if(this.form_rto_id!="0" && typeof this.form_rto_id !== 'undefined' && regYear!="")
		{
			
			var selectedSlide="6";
			this.myCarousel.select(selectedSlide);
		}
	}
	
	/*****************************************************/
				//Filter RTO based on City
	/*****************************************************/
	filterRTO(city_id)
	{
		var filter_rto=[];
		var output :any;
		output={"id":0,"text":"Select RTO (e.g. MH02 or Mumbai)"};
		filter_rto.push(output);
		this.rtoJson.forEach(el => {
			if(el.city_id==city_id)
			{
				output={"id":el.id,"text":el.rto_code};
				filter_rto.push(output);
			}
		});
		this.totalRTOList=filter_rto;
	}
	
	/***************************************************/
				//Form Submit For Twowheeler
	/***************************************************/
	
	quoteSubmit() {
		this.quoteSubmitted = true;
		if (this.quoteForm.invalid) {
			return;
		}
		else
		{
			let now = new Date();
			let registrationDate = {year: parseInt(this.quoteForm.value.regYear), month: now.getMonth() + 1, day: 1};
			let manufactureDate = {year: parseInt(this.quoteForm.value.regYear), month: now.getMonth() + 1};
			this.quoteJson={
				"brand_code":this.form_brand,
				"model_code":this.form_model,
				"fuel_type":this.form_fuel,
				"variant_code":this.form_variant,
				"rto_id":this.form_rto_id,
				"rto_code":this.form_rto_code,
				"bike_id":this.form_car,
				"form_premium_type":this.form_premium_type,
				"cust_email":this.quoteForm.value.custEmail,
				"cust_phone":this.quoteForm.value.custPhone,
				"policy_expiry_date":this.quoteForm.value.policyExpiryDate,
				"registration_date":registrationDate,
				"manufacture_date":manufactureDate,
				"last_claimed_year":this.quoteForm.value.lastClaimedYear,
				"bike_fullname":this.bikeText,
				"brand_name":this.brandText,
				"model_name":this.modelText,
				"fuel_name":this.fuelText,
				"variant_name":this.variantText,
			};
			
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				console.log("Local Storage: "+this.quoteJson);
				this.router.navigate(['/quote-compare']);
			});
		}
	}
	
}
