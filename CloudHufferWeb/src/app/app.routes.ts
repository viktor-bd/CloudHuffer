import { Routes } from '@angular/router';
import { BookmarkSelectorComponent } from './probe/bookmark-selector.component';
import { ProbeParserComponent } from './probe/probe-parser.component';

export const AppRoutes: Routes = [
    {path: 'bookmarks', component: BookmarkSelectorComponent},
    {path: 'probe', component: ProbeParserComponent},
    {path: '', redirectTo: '/probe', pathMatch: 'full'}
    // future routes
];
