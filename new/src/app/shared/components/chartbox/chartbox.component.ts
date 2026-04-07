import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chartbox',
  imports: [],
  templateUrl: './chartbox.component.html',
  styleUrl: './chartbox.component.scss'
})
export class ChartboxComponent {
 @Input() title!: string;
}
