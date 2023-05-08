import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-month',
  templateUrl: './month.page.html',
  styleUrls: ['./month.page.scss'],
})
export class MonthPage implements OnInit {
  incomeMap = new Map<string, number>();
  expenseMap = new Map<string, number>();
  combinedMap = new Map<string, Map<string,number>>();
  dailyIncome = new Map<string, number>();
  dailyExpense = new Map<string, number>();
  incomeTotal: number = 0;
  incomeDailyTotal: number = 0;
  expenseTotal: number = 0;
  expenseDailyTotal: number = 0;
  tempDate: string ="";

  constructor(private str: Storage) { }

  ngOnInit() {
    this.loadMonth();
    this.setDateValue();
  }

  //Loads data from the current month
  async loadMonth() {
    await this.str.create();

    //Iterate over every possible date in a month and check if there's data entry there.
    //If there is, add to dailyIncome and dailyExpense to display to table.
    for(let i = 1; i <= 31; i++) {
      await this.str.get(i.toString()+"/"+this.dateString).then(result => {
        if(result)
          this.combinedMap = result;
        else {
          console.log("No data exists for "+i.toString()+"/"+this.dateString);
          return;
        }

      //These two if statements are much the same, though I wasn't sure how to collapse them into one.
      //Gets the income and expense from the current date (if it exists), then increments a total and
      //puts them in a dailyIncome/Expense map used to display a total income/expense for that day.

      if(this.combinedMap.get("Income")) {
        this.incomeDailyTotal = 0;
        this.incomeMap = this.combinedMap.get("Income")!;

        this.incomeMap.forEach((value, key) => {
          this.incomeTotal += +value;
          this.incomeDailyTotal += +value;
        });

        this.dailyIncome.set(i.toString()+"/"+this.dateString, this.incomeTotal);
      }
        
      if(this.combinedMap.get("Expense")) {
        this.expenseDailyTotal = 0;
        this.expenseMap = this.combinedMap.get("Expense")!;

        this.expenseMap.forEach((value, key) => {
          this.expenseTotal += +value;
          this.expenseDailyTotal += +value;
        });

        this.dailyExpense.set(i.toString()+"/"+this.dateString, this.expenseDailyTotal);
      }
      });
    }
  }

//Dates
date: any;
dateString: string = "";
day: any;
month: any;
year: any;
validDates: string[] = [];
setDateValue() {
  this.date = new Date();
  this.day = this.date.getDate();
  this.month = this.date.getMonth()+1;
  this.year = this.date.getFullYear();

  this.dateString = this.month+"/"+this.year; //Date is only month/year in this page to work with loadMonth function.
}


}
