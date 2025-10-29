import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getAllCategoriesWithRelaxingSounds(): Observable<any> {
    return this.http.get("/json/relaxing-sound-data.json");
  }
}
