import { Component } from '@angular/core';
import { ProbeService, Bookmark } from './probe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookmark-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
