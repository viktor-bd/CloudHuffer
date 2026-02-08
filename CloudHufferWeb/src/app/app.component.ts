import { Component } from '@angular/core';
import { ProbeParserComponent } from './components/probe-parser.component';

@Component({
  selector: 'app-root',
  imports: [ProbeParserComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CloudHufferWeb';
}
