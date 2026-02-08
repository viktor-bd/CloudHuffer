import { Component } from '@angular/core';
import { ProbeService, Bookmark } from './probe.service';

@Component({
  selector: 'app-bookmark-selector',
  templateUrl: './bookmark-selector.component.html',
  styleUrls: ['./bookmark-selector.component.scss']
})
export class BookmarkSelectorComponent {
  bookmarks: Bookmark[] = [];
  selectedBookmark: string | null = null;

  constructor(private probeService: ProbeService) {
    this.probeService.getBookmarks().subscribe(bms => this.bookmarks = bms);
  }
}
