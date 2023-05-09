import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }


  //Considering the finance theme of this app, I've gone with this API: https://github.com/fawazahmed0/currency-api#readme
  //It has no rate limits!

  //Gets the exchange rates based on a specific currency ID into it.
  getSpecificCurrencyData(currency:any):Observable<any> {
    return this.http.get('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/'+currency+'.min.json');
  }

  getAllCurrencies():Observable<any> {
    return this.http.get('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json');
  }

}
