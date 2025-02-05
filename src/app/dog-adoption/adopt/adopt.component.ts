import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../core/loader/loader.service';

@Component({
  selector: 'app-adopt',
  standalone: false,
  templateUrl: './adopt.component.html',
  styleUrls: ['./adopt.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdoptComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  adoptForm!: FormGroup;
  colors = ['White', 'Black', 'Brown', 'Golden', 'Gray', 'Mixed'];
  loading: boolean = false;
  successMessage: string = '';
  private readonly MIN_WEIGHT = 1;
  private readonly MAX_WEIGHT = 100;
  private readonly MIN_AGE = 0;
  private readonly MAX_AGE_DEFAULT = 20;
  private readonly MAX_AGE_FIRST_ADOPTION = 8;
  private readonly SUCCESS_MSG = 'Your adoption request has been registered in the system.';

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.initialForm();
    this.registerValidators();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initialForm() {
    this.adoptForm = this.fb.group({
      weight: [null, [Validators.required, Validators.min(this.MIN_WEIGHT), Validators.max(this.MAX_WEIGHT)]],
      color: ['', Validators.required],
      firstAdoption: [false],
      age: [null, [Validators.required, Validators.min(this.MIN_AGE), Validators.max(this.MAX_AGE_DEFAULT)]]
    });
  }

  private registerValidators() {
    const sub = this.firstAdoptionControl?.valueChanges.subscribe(value => this.
      updateAgeValidators(value)) || new Subscription();;
    this.subscriptions.push(sub);
  }

  private updateAgeValidators(isFirstAdoption: boolean) {
    const maxAge = isFirstAdoption ? this.MAX_AGE_FIRST_ADOPTION : this.MAX_AGE_DEFAULT;
    this.ageControl?.setValidators([Validators.required, Validators.min(this.MIN_AGE), Validators.max(maxAge)]);
    this.ageControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.adoptForm.invalid) return;

    this.loaderService.showLoader();
    this.successMessage = '';

    setTimeout(() => {
      this.loaderService.hideLoader();
      this.successMessage = this.SUCCESS_MSG;
      this.cdRef.markForCheck();
    }, 2000);
  }

  getErrorMessage(field: string): string | null {
    const control = this.adoptForm.get(field);
    if (control?.touched && control.invalid) {
      if (control.errors?.['required']) return 'This field is required.';
      if (control.errors?.['min']) return `Minimum value is ${control.errors['min'].min}.`;
      if (control.errors?.['max']) return `Maximum value is ${control.errors['max'].max}.`;
    }
    return null;
  }

  get weightControl() {
    return this.adoptForm.get('weight');
  }

  get colorControl() {
    return this.adoptForm.get('color');
  }

  get firstAdoptionControl() {
    return this.adoptForm.get('firstAdoption');
  }

  get ageControl() {
    return this.adoptForm.get('age');
  }
}
