import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '~/src/environments/environment';
import { Email } from '../models/email-interfaces';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  readonly #http = inject(HttpClient);

  report(email: Email) {
    return this.#http.post(`${environment.apiUrl}/send-email`, email);
  }
}
