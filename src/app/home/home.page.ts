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
  model = {
    asset: true,
    name: true,
    category: true,
    location: true,
    description: true
  }
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
  duplicateData: any;
  columns = [
    { name: "Asset ID", visible: true },
    { name: "Name", visible: true },
    { name: "Category", visible: true },
    { name: "Location", visible: true },
    { name: "Description", visible: true },
  ];
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
    console.log("Home ngOnInit")
  }

  reloadItems(params) {
    this.itemResource.query(params).then(items => this.items = items);
    this.items.filter(i => { return i.filterFlag = false, i.showAction = false });
  }

  // special properties:
  async rowClick(rowEvent) {
    console.log('Clicked: ', rowEvent);
    if (rowEvent.property.toLowerCase() !== 'action') {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Click',
        message: 'Clicked on AssetId ' + rowEvent.row.item.assetId,
        buttons: ['Ok']
      });

      await alert.present();

      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
  }

  rowDoubleClick(rowEvent) {
    // alert('Double clicked: ' + rowEvent.row.item.name);
  }

  rowTooltip(item) {
    return item.NPI;
  }

  cellColor(car) {
    return '#fafafa';
  }

  buttonalert(param: any) {
    alert(param);
  }

  selectedRow(ev) {
    console.log(ev)
    if (ev?.length > 0) {
      this.showDelete = true;
    } else {
      this.showDelete = false;
    }

  }
  async DeleteRow() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete?',
      message: 'Are you sure you want to delete?',
      buttons: ['Cancel', 'Delete']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

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
