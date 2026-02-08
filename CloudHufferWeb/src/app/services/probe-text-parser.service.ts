import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParsedSiteResult, ProbeTextInput } from '../models/probe-parser.models';

@Injectable({
  providedIn: 'root'
})
export class ProbeTextParserService {
  // Use a relative path so the Angular dev server can proxy to the backend
  // via proxy.conf.json. This avoids hard-coded host/port and CORS issues.
  private readonly apiUrl = '/api/ProbeTextParser';

  constructor(private http: HttpClient) {}

  parseProbeText(probeText: string): Observable<ParsedSiteResult[]> {
    const input: ProbeTextInput = { probeText };
    return this.http.post<ParsedSiteResult[]>(`${this.apiUrl}/parse`, input);
  }
}
