import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Bookmark {
  id: string;
  name: string;
}

export interface ParseEnvelope {
  success: boolean;
  results?: any[];
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ProbeService {
  constructor(private http: HttpClient) {}

  parseText(text: string): Observable<ParseEnvelope> {
    if (!text || !text.trim()) {
      return of({ success: true, results: [] });
    }

    return this.http.post<any[]>('/api/probetextparser/parse', { probeText: text }).pipe(
      map(results => ({ success: true, results })),
      catchError(err => of({ success: false, error: err?.message || 'Request failed' }))
    );
  }

  getBookmarks(): Observable<Bookmark[]> {
    return of([]);
  }
}
