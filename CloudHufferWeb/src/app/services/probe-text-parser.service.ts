import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParsedSiteResult, ProbeTextInput } from '../models/probe-parser.models';

@Injectable({
  providedIn: 'root'
})
export class ProbeTextParserService {
  private readonly apiUrl = 'http://localhost:5161/api/ProbeTextParser';

  constructor(private http: HttpClient) {}

  parseProbeText(probeText: string): Observable<ParsedSiteResult[]> {
    const input: ProbeTextInput = { probeText };
    return this.http.post<ParsedSiteResult[]>(`${this.apiUrl}/parse`, input);
  }
}