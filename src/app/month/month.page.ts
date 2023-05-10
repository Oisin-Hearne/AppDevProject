import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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
  dataFound: number = 0;
  tempDate: string ="";

  fileString: string = "";

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
        if(result) {
          this.combinedMap = result;
          this.dataFound = 1;
        }   
        else {
          {
            console.log("No data exists for "+i.toString()+"/"+this.dateString);
            this.dataFound = 0;
          }
        }

      //These two if statements are much the same, though I wasn't sure how to collapse them into one.
      //Gets the income and expense from the current date (if it exists), then increments a total and
      //puts them in a dailyIncome/Expense map used to display a total income/expense for that day.

      if(this.combinedMap.get("Income") && this.dataFound == 1) {
        this.incomeDailyTotal = 0;
        this.incomeMap = this.combinedMap.get("Income")!;

        this.incomeMap.forEach((value, key) => {
          this.incomeTotal += +value;
          this.incomeDailyTotal += +value;
        });

        this.dailyIncome.set(i.toString()+"/"+this.dateString, this.incomeDailyTotal);
      }
        
      if(this.combinedMap.get("Expense") && this.dataFound == 1) {
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

  //Creates a string for all the data and writes it to a file in the Documents directory, if it exists.
  //I was unable to get the app to load onto a physical android device, so I'm unsure if this actually works. Hopefully it does though.
  async fileSave() {

    //Create string
    this.fileString += "Income:\n";
    this.dailyIncome.forEach((value, key) => {
      this.fileString += key+" - "+value+"€\n";
    });

    this.fileString += "\nExpenditure:\n";
    this.dailyExpense.forEach((value, key) => {
      this.fileString += key+" - "+value+"€\n";
    });

    this.fileString += "\nTotal Income: "+this.incomeTotal+"€\nTotal Expenditure: "+this.expenseTotal+"€";

    //Plugin Implementation - FileSystem. Used this to allow the user to save budget results as a txt.
    await Filesystem.writeFile({
      path: '/Budget-'+this.dateString+'.txt',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
      data: this.fileString,
    });
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
  this.month = this.date.getMonth()+1; //Why on earth do javascript months start from 0
  this.year = this.date.getFullYear();

  this.dateString = this.month+"/"+this.year; //Date is only month/year in this page to work with loadMonth function.
}
}
