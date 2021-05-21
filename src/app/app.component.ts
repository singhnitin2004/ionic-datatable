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
  constructor(private http: HttpClient, private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef, public alertController: AlertController) {
  }

  ngOnInit(): void {

  }

}
