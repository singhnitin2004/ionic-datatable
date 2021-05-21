import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'min'
})
export class MinPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
