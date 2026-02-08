import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProbeParserComponent } from './probe-parser.component';
import { BookmarkSelectorComponent } from './bookmark-selector.component';

@NgModule({
  imports: [CommonModule, FormsModule, ProbeParserComponent, BookmarkSelectorComponent],
  exports: [ProbeParserComponent, BookmarkSelectorComponent]
})
export class ProbeModule {}
