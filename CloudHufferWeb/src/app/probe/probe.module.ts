import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// ProbeModule retained for legacy imports, but actual components moved to src/app/components
// ProbeParserComponent now lives at src/app/components/probe-parser.component
// BookmarkSelectorComponent is a standalone component under src/app/probe

@NgModule({
  imports: [CommonModule, FormsModule, ProbeParserComponent, BookmarkSelectorComponent],
  exports: [ProbeParserComponent, BookmarkSelectorComponent]
})
export class ProbeModule {}
