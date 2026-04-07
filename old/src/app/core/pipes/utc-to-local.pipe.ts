import { Pipe, PipeTransform } from '@angular/core';
import { DateService } from '../../../services/date.service';

@Pipe({
  standalone: true,
  name: 'utcToLocal',
  pure: true,
})
export class UtcToLocalPipe implements PipeTransform {
  constructor(private dateService: DateService) {}
  transform(utcDate: string | Date | null | undefined): Date | string | null {
    if (!utcDate) return null;

    return this.dateService.convertUTCToLocal(utcDate);
  }
}
