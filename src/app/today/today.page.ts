import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {AlertController} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-today',
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
})
export class TodayPage implements OnInit {
  incomeMap = new Map<string, number>();
  expenseMap = new Map<string, number>();
  combinedMap = new Map<string, Map<string,number>>();
  saveStatus: string = "Save";

  constructor(private ac: AlertController,
    private cd: ChangeDetectorRef,
    private str: Storage) { }

  //why is javascript like this
  ngOnInit() {
    this.setDateValue();
    this.loadStr();
  }

  incomeName: string="";
  incomeAmount: number=0;
  expenseName: string="";
  expenseAmount: number=0;

  //I learned how to use alerts from the documentation: https://ionicframework.com/docs/v6/api/alert#events
  //As well as this stack overflow post for getting the data from them: https://stackoverflow.com/questions/55540312/get-value-from-input-in-ionic-4-alert
  async addIncome() {
    //Display Alert
    const alert = await this.ac.create({
      header: 'Enter Income Details',
      buttons: [
        {text:'Add'}
      ],
      inputs: [
        {placeholder: 'Name', name: 'incomeTitle'},
        {placeholder: 'Amount', type: 'number', name: 'incomeWorth'}
      ],
    });
    await alert.present();

    //Values from Alert
    const output = await alert.onDidDismiss();
    this.incomeMap.set(output.data.values.incomeTitle, output.data.values.incomeWorth);
    this.cd.detectChanges();
  }

  async addExpense() {
    //Display Alert
    const alert = await this.ac.create({
      header: 'Enter Expense Details',
      buttons: [
        {text:'Add'}
      ],
      inputs: [
        {placeholder: 'Name', name: 'expenseTitle'},
        {placeholder: 'Amount', type: 'number', name: 'expenseWorth'}
      ],
    });
    await alert.present();
    
    //Values from Alert
    const output = await alert.onDidDismiss();
    this.expenseMap.set(output.data.values.expenseTitle, output.data.values.expenseWorth);
    this.cd.detectChanges();
  }

  async onSave() {
    await this.str.create();
    this.combinedMap.set("Income", this.incomeMap);
    this.combinedMap.set("Expense", this.expenseMap);
    await this.str.set(this.dateString, this.combinedMap);

    this.saveStatus = "Saved!";
  }

  async loadStr() {
    await this.str.create();
    this.combinedMap = await this.str.get(this.dateString);
    if(this.combinedMap.get("Income") !== undefined) {
      this.incomeMap = this.combinedMap.get("Income")!;
    }
    if(this.combinedMap.get("Expense") !== undefined) {
      this.expenseMap = this.combinedMap.get("Expense")!;
    }

  }

//Dates
  date: any;
  dateString: string = "";
  day: any;
  month: any;
  year: any;
  setDateValue() {
    this.date = new Date();
    this.day = this.date.getDate();
    this.month = this.date.getMonth()+1;
    this.year = this.date.getFullYear();

    this.dateString = ""+this.day+"/"+this.month+"/"+this.year;
  }

}
