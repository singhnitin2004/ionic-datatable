import { Directive, ElementRef, Renderer2 } from '@angular/core';


function isBlank(obj: any): boolean {
  return obj === undefined || obj === null;
}

@Directive({ selector: '[hide]', inputs: ['hide'] })
export class Hide {

  private _prevCondition: boolean = null;
  private _displayStyle: string;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer2) { }

  set hide(newCondition: boolean) {
    this.initDisplayStyle();

    if (newCondition && (isBlank(this._prevCondition) || !this._prevCondition)) {
      this._prevCondition = true;
      this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'none');
    } else if (!newCondition && (isBlank(this._prevCondition) || this._prevCondition)) {
      this._prevCondition = false;
      this._renderer.setStyle(this._elementRef.nativeElement, 'display', this._displayStyle);
    }
  }

  private initDisplayStyle() {
    if (this._displayStyle === undefined) {
      const displayStyle = this._elementRef.nativeElement.style.display;
      if (displayStyle && displayStyle !== 'none') {
        this._displayStyle = displayStyle;
      }
    }
  }
}
