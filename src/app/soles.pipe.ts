import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'soles'
})
export class SolesPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value)) return 'S/. 0.00';
    return `S/. ${value.toFixed(2)}`;
  }

}
