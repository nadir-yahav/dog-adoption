import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { AdoptComponent } from './adopt/adopt.component';
import { DogAdoptionComponent } from './dog-adoption.component';
import { provideHttpClient } from '@angular/common/http';
import { DogService } from './dog-adoption.service';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: DogAdoptionComponent, children: [
      { path: 'search', component: SearchComponent },
      { path: 'adopt', component: AdoptComponent },
      { path: '', redirectTo: 'search', pathMatch: 'full' }
    ] 
  }
];

@NgModule({
  declarations: [
    DogAdoptionComponent, 
    SearchComponent, 
    AdoptComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    DogService,
    provideHttpClient()
  ]
})
export class DogAdoptionModule { }
