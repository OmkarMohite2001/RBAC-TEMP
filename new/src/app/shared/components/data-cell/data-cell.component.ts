import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-cell',
  imports: [],
  templateUrl: './data-cell.component.html',
  styleUrl: './data-cell.component.scss',
})
export class DataCellComponent {
  @Input() title!: string;
  @Input() text!: string;
}
