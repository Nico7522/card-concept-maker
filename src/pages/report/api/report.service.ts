import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  readonly #http = inject(HttpClient);

  report(report: { type: string; message: string }) {
    return this.#http.post(environment.reportUrl, report);
  }
}
