import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DogService } from '../dog-adoption.service';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../core/loader/loader.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  searchForm!: FormGroup;
  breeds: string[] = [];
  images: string[] = [];
  private readonly MIN_TO_SHOW = 1;
  private readonly MAX_TO_SHOW = 50;
  get countControl() {
    return this.searchForm.get('count');
  }

  constructor(
    private fb: FormBuilder,
    private dogService: DogService,
    private loaderService: LoaderService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.initialForm();
    this.getBreeds();
    this.registerControlsValueChanges();
  }

  private getBreeds() {
    const sub = this.dogService.getBreeds().subscribe(breeds => {
      this.breeds = breeds;
      this.cdRef.markForCheck();
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initialForm() {
    this.searchForm = this.fb.group({
      breed: [''],
      count: [12]
    });
  }

  private registerControlsValueChanges() {
    const subCount = this.countControl?.valueChanges.subscribe(value => this.correctCountValue(value)) || new Subscription();
    this.subscriptions.push(subCount);

    const subSearch = this.searchForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => {
        return prev.breed === curr.breed && prev.count === curr.count;
      }),
      tap(() => this.loaderService.showLoader()),
      switchMap(formValues => {
        const { breed, count } = formValues;
        if (!breed || !count)
          return [];
        return this.dogService.getBreedImages(breed, count).pipe(
          finalize(() => setTimeout(() => this.loaderService.hideLoader(), 1000)))
      })
    ).subscribe(images => {
      this.images = images;
      this.cdRef.markForCheck();
    });
    this.subscriptions.push(subSearch);
  }

  correctCountValue(value: any): void {
    if (value < this.MIN_TO_SHOW) {
      this.countControl?.setValue(this.MIN_TO_SHOW, { emitEvent: false });
    }
    else if (value > this.MAX_TO_SHOW) {
      this.countControl?.setValue(this.MAX_TO_SHOW, { emitEvent: false });
    }
  }
}
