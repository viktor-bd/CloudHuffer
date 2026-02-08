import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Bookmark {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ProbeService {
  parseText(text: string): Observable<any[]> {
    // TODO: Call backend API
    return of([]);
  }

  getBookmarks(): Observable<Bookmark[]> {
    // TODO: Fetch bookmarks from backend or local storage
    return of([]);
  }
}
