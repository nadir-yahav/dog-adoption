import { Component } from '@angular/core';
import { LoaderService } from './loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  loading$;

  constructor(private loaderService: LoaderService) {
    this.loading$ = this.loaderService.loaderState$;
  }

}
