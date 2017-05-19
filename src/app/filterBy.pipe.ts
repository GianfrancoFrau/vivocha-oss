import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy'
})
export class FilterByPipe implements PipeTransform {

  transform(value: any, filter: any): any {
    if(filter) {
      // NOTE use a regExp ?
      return value.filter((item) => item.name.startsWith(filter));
    }
    return value;
  }

}
