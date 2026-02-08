import { Component } from '@angular/core';
import { ProbeService } from './probe.service';

@Component({
  selector: 'app-probe-parser',
  templateUrl: './probe-parser.component.html',
  styleUrls: ['./probe-parser.component.scss']
})
export class ProbeParserComponent {
  probeText = '';
  results: any[] = [];
  loading = false;

  constructor(private probeService: ProbeService) {}

  parse() {
    this.loading = true;
    this.probeService.parseText(this.probeText).subscribe(res => {
      this.results = res;
      this.loading = false;
    });
  }
}
