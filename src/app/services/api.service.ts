import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse  } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	
	NODE_URL  =  'http://67.211.45.49:8009/action';
	//NODE_URL  =  'http://192.168.7.160:3000/action';
	constructor(private  httpClient:  HttpClient) { }
	getPremium(quoteJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		console.log(quoteJson);
		console.log(this.NODE_URL);
		return this.httpClient.post(this.NODE_URL,quoteJson);
		
		//console.log(quoteJson);
	}
	createProposal(proposalJson){
		
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		console.log(proposalJson);
		console.log(this.NODE_URL);
		return this.httpClient.post(this.NODE_URL,proposalJson);
		
		//console.log(quoteJson);
	}
}
