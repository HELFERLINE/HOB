import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  get host() {
    return environment.booking.host;
  }

  get basePath() {
    return environment.booking.path;
  }

  get schema() {
    return environment.booking.schema;
  }

  get port() {
    return environment.booking.port;
  }

  get fullUrl() {
    return `${this.schema}://${this.host}:${this.port}/${this.basePath}`
  }

  constructor(
    private http: HttpClient
  ) { }

  get<O>(url: string, options?: { params?: HttpParams, headers?: any }, isFullUrl?: boolean) {
    let fullUrl = isFullUrl ? url : `${this.fullUrl}/${url}`;

    return this.http.get<O>(fullUrl, options);
  }

  post<O, I>(url: string, body: I, options?: { params?: HttpParams, headers?: any }, isFullUrl?: boolean) {
    let fullUrl = isFullUrl ? url : `${this.fullUrl}/${url}`;

    return this.http.post<O>(fullUrl, body, options);
  }

  patch<O, I>(url: string, body: I, options?: { headers?: any }, isFullUrl?: boolean) {
    let fullUrl = isFullUrl ? url : `${this.fullUrl}/${url}`;

    return this.http.patch<O>(fullUrl, body, options);
  }

  put<O, I>(url: string, body: I, options?: { headers?: any }, isFullUrl?: boolean) {
    let fullUrl = isFullUrl ? url : `${this.fullUrl}/${url}`;

    return this.http.put<O>(fullUrl, body, options);
  }

  delete<O>(url: string, options?: { headers?: any }, isFullUrl?: boolean) {
    let fullUrl = isFullUrl ? url : `${this.fullUrl}/${url}`;

    return this.http.delete<O>(fullUrl, options);
  }
}
