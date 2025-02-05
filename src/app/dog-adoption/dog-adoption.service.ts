import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class DogService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBreeds(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/breeds/list/all`).pipe(
      map(res => Object.keys(res.message).filter(breed => res.message[breed].length > 0))
    );
  }

  getBreedImages(breed: string, count: number): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/breed/${breed}/images/random/${count}`).pipe(
      map(res => res.message)
    );
  }
}
