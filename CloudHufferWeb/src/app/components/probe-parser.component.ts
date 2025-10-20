import { Component, OnInit } from '@angular/core';
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
export class ProbeParserComponent implements OnInit {
  probeText = '';
  results: ParsedSiteResult[] = [];
  filteredResults: ParsedSiteResult[] = [];
  isLoading = false;
  errorMessage = '';
  
  // Filter settings
  filterNonGasSites = true;  // Default to showing only gas sites
  allowUnscannedSites = false;  // Default to hiding unscanned signatures

  constructor(private probeTextParserService: ProbeTextParserService) {}

  ngOnInit(): void {
    this.applyFilters();
  }

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
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error parsing probe text:', error);
        this.errorMessage = 'Failed to parse probe text. Please check the API connection.';
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  isGasSite(siteName: string): boolean {
    // Unscanned signatures (could be gas sites)
    if (siteName === 'Cosmic Signature') {
      return true;
    }
    
    // Known gas site naming patterns in EVE Online
    const gasSitePatterns = [
      'Reservoir',    // Perimeter Reservoir, Core Reservoir, etc.
      'Nebula',       // Various gas nebula types
      'Ladar',        // Ladar site type
      'Pocket',       // Some gas sites are called pockets
      'Cloud'         // Gas cloud sites
    ];
    
    return gasSitePatterns.some(pattern => siteName.includes(pattern));
  }

  getSiteTypeDisplay(siteName: string): string {
    if (siteName === 'Cosmic Signature') {
      return '—';  // Unscanned, unknown type
    } else if (this.isGasSite(siteName)) {
      const gasComposition = this.getGasComposition(siteName);
      return gasComposition !== 'Unknown' ? gasComposition : 'Gas Site';
    } else {
      return 'Other Site';  // Combat, Ore, etc.
    }
  }

  getGasComposition(siteName: string): string {
    // Gas composition mapping from GasCloudTable.md
    // Maps reservoir names to their primary gas type
    const gasMapping: { [key: string]: string } = {
      // Perimeter Reservoirs
      'Ordinary Perimeter Reservoir': 'C72',
      'Sizable Perimeter Reservoir': 'C84',
      'Sizeable Perimeter Reservoir': 'C84',  // Handle British spelling variant
      'Minor Perimeter Reservoir': 'C70',
      'Token Perimeter Reservoir': 'C60',
      'Barren Perimeter Reservoir': 'C50',
      
      // Frontier Reservoirs  
      'Bountiful Frontier Reservoir': 'C28',
      'Vast Frontier Reservoir': 'C32',
      
      // Core Reservoirs
      'Instrumental Core Reservoir': 'C320',
      'Vital Core Reservoir': 'C540'
    };
    
    return gasMapping[siteName] || 'Unknown';
  }

  private applyFilters(): void {
    let filtered = [...this.results];

    // Filter non-gas sites if enabled
    if (this.filterNonGasSites) {
      filtered = filtered.filter(result => this.isGasSite(result.siteName));
    }

    // Filter unscanned sites if not allowed
    // Unscanned sites have siteName exactly equal to "Cosmic Signature"
    if (!this.allowUnscannedSites) {
      filtered = filtered.filter(result => result.siteName !== 'Cosmic Signature');
    }

    this.filteredResults = filtered;
  }

  onClear(): void {
    this.probeText = '';
    this.results = [];
    this.filteredResults = [];
    this.errorMessage = '';
  }

  loadSampleData(): void {
    this.probeText = `HTX-750	Cosmic Signature			0,0%	11,16 AU
PBJ-525	Cosmic Signature			0,0%	15,45 AU
GCX-866    Cosmic Signature    Gas Site    Ordinary Perimeter Reservoir    100.0%    7.67 AU
VVA-330 Cosmic Signature	Gas Site    Sizeable Perimeter Reservoir    100.0%    4.38 AU`;
  }

  getGasSites(): ParsedSiteResult[] {
    return this.filteredResults.filter(result => result.siteName !== 'Cosmic Signature');
  }

  getRandomISK(): string {
    // Placeholder for ISK calculation - will be replaced with real calculations
    const iskValues = ['20.1', '24.8', '18.3', '32.1', '15.7'];
    return iskValues[Math.floor(Math.random() * iskValues.length)];
  }
}