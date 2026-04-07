import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-data-row',
  imports: [CommonModule],
  templateUrl: './data-row.component.html',
  styleUrl: './data-row.component.scss'
})
export class DataRowComponent {
  @Input() title?: string;
}
