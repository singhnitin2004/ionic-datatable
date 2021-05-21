import { Component } from '@angular/core';
import { DataTableResource } from '../data-table/data-table.module';
import persons from './data-table-demo';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  selectAll: boolean;
  showMoreFilterModel = [
    { name: 'Meta Data', select: false },
    { name: 'Tags', select: false },
    { name: 'Modification Date', select: false },
    { name: 'QR Logo', select: false },
    { name: 'Custom Field', select: false },
  ]
  advanceFilter = {
    category: '',
    date: '',
    location: '',
    status: '',
  }
  showSelect: boolean = false;
  showCreate: boolean = false;
  showFilter: boolean = false;
  showDelete: boolean = false;
  disableExport: boolean = false;
  showMoreFilter: boolean = false;
  showExpand: boolean = false;
  itemResource = new DataTableResource(persons);
  items = [];
  itemCount = 0;
  totalPages = 9;
  size = 10;

  constructor(public alertController: AlertController) {
  }


  ngOnInit(): void {
  }

  //Get Initial data
  getData(params) {
    this.itemResource.query(params).then(items => this.items = items);
    this.items.filter(i => { return i.filterFlag = false, i.showAction = false });
  }

  //on row click
  async rowClick(rowEvent) {
    if (rowEvent.property.toLowerCase() !== 'action') {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Click',
        message: 'Clicked on AssetId ' + rowEvent.row.item.assetId,
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

  // display delete button on selecting the row
  selectedRow(ev) {
    if (ev?.length > 0) {
      this.showDelete = true;
    } else {
      this.showDelete = false;
    }
  }

  //on click the deleting button
  async DeleteRow() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete?',
      message: 'Are you sure you want to delete?',
      buttons: ['Cancel', 'Delete']
    });
    await alert.present();
  }

  //for reseting the filter
  resetFilter() {
    this.advanceFilter = {
      category: '',
      date: '',
      location: '',
      status: '',
    }
    this.showMoreFilterModel = [
      { name: 'Meta Data', select: false },
      { name: 'Tags', select: false },
      { name: 'Modification Date', select: false },
      { name: 'QR Logo', select: false },
      { name: 'Custom Field', select: false },
    ]
  }
}
