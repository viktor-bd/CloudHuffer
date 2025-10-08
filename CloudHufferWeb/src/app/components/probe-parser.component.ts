import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProbeTextParserService } from '../services/probe-text-parser.service';
import { ParsedSiteResult } from '../models/probe-parser.models';

@Component({
  selector: 'app-probe-parser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './probe-parser.component.html',
  styleUrl: './probe-parser.component.css'
})
export class ProbeParserComponent {
  probeText = '';
  results: ParsedSiteResult[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private probeTextParserService: ProbeTextParserService) {}

  onParseProbeText(): void {
    if (!this.probeText.trim()) {
      this.errorMessage = 'Please enter some probe scanner text';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.results = [];

    this.probeTextParserService.parseProbeText(this.probeText).subscribe({
      next: (results) => {
        this.results = results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error parsing probe text:', error);
        this.errorMessage = 'Failed to parse probe text. Please check the API connection.';
        this.isLoading = false;
      }
    });
  }

  onClear(): void {
    this.probeText = '';
    this.results = [];
    this.errorMessage = '';
  }

  loadSampleData(): void {
    this.probeText = `HTX-750	Cosmic Signature			0,0%	11,16 AU
PBJ-525	Cosmic Signature			0,0%	15,45 AU
GCX-866    Cosmic Signature    Gas Site    Ordinary Perimeter Reservoir    100.0%    7.67 AU
VVA-330 Cosmic Signature	Gas Site    Sizeable Perimeter Reservoir    100.0%    4.38 AU`;
  }

  getGasSites(): ParsedSiteResult[] {
    return this.results.filter(result => result.siteName !== 'Cosmic Signature');
  }

  getRandomISK(): string {
    // Placeholder for ISK calculation - will be replaced with real calculations
    const iskValues = ['20.1', '24.8', '18.3', '32.1', '15.7'];
    return iskValues[Math.floor(Math.random() * iskValues.length)];
  }
}