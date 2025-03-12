import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {urlJoin} from '@angular-devkit/build-angular/src/utils';

export const BASE_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    public http: HttpClient,
  ) {}

  get<T>(prefix: string, params: any = {}) {
    return this.http.get<T>(urlJoin(BASE_URL, prefix), { params: params });
  }

  post<T>(prefix: string, body: any = {}) {
    return this.http.post<T>(urlJoin(BASE_URL, prefix), body);
  }

  put<T>(prefix: string, body: any = {}) {
    return this.http.put<T>(urlJoin(BASE_URL, prefix), body);
  }
  patch<T>(prefix: string, body: any = {}) {
    return this.http.patch<T>(urlJoin(BASE_URL, prefix), body);
  }
}
