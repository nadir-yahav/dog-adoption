import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'dog-adoption', loadChildren: () => import('./dog-adoption/dog-adoption.module').then(m => m.DogAdoptionModule) },
    { path: '', redirectTo: 'dog-adoption', pathMatch: 'full' }
  ];
