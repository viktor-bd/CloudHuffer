import { Routes } from '@angular/router';
import { ProbeParserComponent } from './components/probe-parser.component';

export const AppRoutes: Routes = [
    {path: 'probe', component: ProbeParserComponent},
    {path: '', redirectTo: '/probe', pathMatch: 'full'}
    // future routes
];
