import { Component, Renderer2, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AlertController } from '@ionic/angular';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'datatables';
  dtOptions: DataTables.Settings = {};
  posts: any;
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
  dtTrigger: Subject<any> = new Subject();
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

  constructor(private http: HttpClient, private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef, public alertController: AlertController) {
    this.renderer.listen('window', 'click', (e: any) => {
      if (e.target.className.indexOf('md hydrated') == -1) {
        if (this.posts) {
          this.CloseAllSideMenuToggle(this.posts);
        }
      }
      if (e.target.className.indexOf('create-botton') == -1) {
        this.showCreate = false;
      }
      if (e.target.className.indexOf('plus-button') == -1) {
        this.showMoreFilter = false;
      }
      if (e.target.className.indexOf('action-button') == -1) {
        if (e.target.className.indexOf('checkbox-class') != -1 || e.target.className.indexOf('checkbox-class') == 0) {
        } else {
          this.showSelect = false;
        }
      }
    })

  }

  ngOnInit(): void {

    this.dtOptions = {
      responsive: true,
      pagingType: 'simple_numbers',
      pageLength: 10,
      processing: true,
      lengthChange: true,
      searching: true,
      paging: true,
      ordering: true,
      deferRender: true,
      autoWidth: false,
      retrieve: true,
      info: true,
      // scrollY: "400px",
      // scrollX: true,
      order: [[1, 'asc']],
      searchDelay: 200,
      dom: 'rt<"bottom"<"left"<"length"l>><"right"<"pagination"p>>>',
      columnDefs: [
        {
          targets: [0, 6],
          "orderable": false
        }
      ],

    };
    this.http.get('../assets/movies.json')
      .subscribe((posts: any) => {
        this.posts = posts.data;
        console.log(posts.data)
        this.posts.filter(i => { return i.filterFlag = false, i.showAction = false });
        this.duplicateData = this.posts;
        setTimeout(() => {
          this.dtTrigger.next();
        }, 100);
        this.changeDetectorRef.detectChanges();
      });
  }

  changeCategory() {
    console.log(this.advanceFilter.category)
  }

  selectALL(event) {
    this.posts.filter(i => { return i.select = event.target.checked });
    if (event.target.checked) {
      this.showDelete = true;
      this.disableExport = true;
    } else {
      this.disableExport = false;
      this.showDelete = false;
    }
  }

  selectRow(event) {
    var post = this.posts.filter(i => { return i.select == true });
    if (post?.length > 0) {
      this.showDelete = true;
      this.disableExport = false;
    } else {
      this.disableExport = false;
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

  OpenSideMenuToggle(obj, lst) {
    for (var i = 0; i < lst.length; i++) {
      if (obj != lst[i]) {
        lst[i].filterFlag = false;
      }
    }
    obj.filterFlag = !obj.filterFlag;
  }

  selectColumn(event) {
    console.log(event)
    switch (event.name) {
      case 'Asset ID':
        this.model.asset = event.visible;
        break;
      case 'Name':
        this.model.name = event.visible;
        break;
      case 'Category':
        this.model.category = event.visible;
        break;
      case 'Location':
        this.model.location = event.visible;
        break;
      case 'Description':
        this.model.description = event.visible;
        break;

      default:
        break;
    }
    console.log(this.model)

  }

  CloseAllSideMenuToggle(lst) {
    for (var i = 0; i < lst.length; i++) {
      lst[i].filterFlag = false;
    }
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
  onResize(event) {
    console.log(event.target.innerWidth)
    event.target.innerWidth;
    if (event.target.innerWidth < 700) {
      this.showExpand = true;
    } else {
      this.showExpand = false;
    }
  }

  showAction(data, event) {
    for (let i = 0; i < this.posts.length; i++) {
      if (i == data) {
        this.posts[i].showAction = true;
      } else {
        this.posts[i].showAction = false;
      }
    }
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
