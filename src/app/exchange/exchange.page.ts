import { Component, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.page.html',
  styleUrls: ['./exchange.page.scss'],
})
export class ExchangePage implements OnInit {
  currencies = new Map<string,string>();
  activeCurrency:Map<string,any> = new Map<string, any>();
  activeCurrencyID: string = "";
  increment: number = 0;

  constructor(private serv: CurrencyService) { }

  ngOnInit() {

    this.serv.getAllCurrencies().subscribe((data) => {
      this.currencies = data;
    });

    this.switchCurrencies("eur"); //Default to euro.
  }

  switchCurrencies(currency: string) { //The currency value is the currency ID, like "eur".
    this.serv.getSpecificCurrencyData(currency).subscribe((data) => {
      this.activeCurrency = new Map(Object.entries(data));
      this.loadCurrency(currency);
    });

    //The json data is split into a "date" and "currencyid", so I need to narrow it down
    //to just the exchange rates by getting the value of "currencyid".

  }

  loadCurrency(currency: string) {
    
    this.activeCurrency = this.activeCurrency.get(currency);

    this.activeCurrencyID = currency;
  }

}
