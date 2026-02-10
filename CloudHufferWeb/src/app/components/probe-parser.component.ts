import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProbeTextParserService } from '../services/probe-text-parser.service';
import { ParsedSiteResult, ManualSiteEntry } from '../models/probe-parser.models';
import { ProfileManagerComponent } from '../profiles/profile-manager.component';

@Component({
  selector: 'app-probe-parser',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './probe-parser.component.html',
  styleUrls: ['./probe-parser.component.css']
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

  // Manual site management
  manualSites: ManualSiteEntry[] = [];
  availableReservoirs: string[] = [
    'Barren Perimeter Reservoir',
    'Token Perimeter Reservoir', 
    'Minor Perimeter Reservoir',
    'Ordinary Perimeter Reservoir',
    'Sizable Perimeter Reservoir',
    'Bountiful Frontier Reservoir',
    'Vast Frontier Reservoir',
    'Instrumental Core Reservoir',
    'Vital Core Reservoir'
  ];

  constructor(private probeTextParserService: ProbeTextParserService) {}

  ngOnInit(): void {
    // Initialize with empty filtered results
    this.filteredResults = [];
    this.gasSites = [];
  }

  // Cached combined gas sites (parsed + manual) to avoid recalculating in template
  gasSites: ParsedSiteResult[] = [];


  // Map of ISK values per signature id to keep values stable across change detection
  private iskMap: Record<string, string> = {};

  onParseProbeText(): void {
    if (!this.probeText.trim()) {
      this.errorMessage = 'Please enter some probe scanner text';
      return;
    }

    console.log('Starting probe text parsing...', this.probeText);
    this.isLoading = true;
    this.errorMessage = '';
    this.results = [];
    this.filteredResults = [];
    this.gasSites = [];
    this.iskMap = {};

    this.probeTextParserService.parseProbeText(this.probeText).subscribe({
      next: (results) => {
        console.log('API response received:', results);
        this.results = results;
        this.applyFilters();
        this.computeGasSitesAndIsk();
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
    this.computeGasSitesAndIsk();
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
    // Each site has both Large Cloud Gas and Small Cloud Gas
    const gasMapping: { [key: string]: { large: string, small: string } } = {
      // Perimeter Reservoirs
      'Barren Perimeter Reservoir': { large: 'C50', small: 'C60' },
      'Token Perimeter Reservoir': { large: 'C60', small: 'C70' },
      'Minor Perimeter Reservoir': { large: 'C70', small: 'C72' },
      'Ordinary Perimeter Reservoir': { large: 'C72', small: 'C84' },
      'Sizable Perimeter Reservoir': { large: 'C84', small: 'C50' },
      'Sizeable Perimeter Reservoir': { large: 'C84', small: 'C50' },  // Handle British spelling variant
      
      // Frontier Reservoirs  
      'Bountiful Frontier Reservoir': { large: 'C28', small: 'C32' },
      'Vast Frontier Reservoir': { large: 'C32', small: 'C28' },
      
      // Core Reservoirs
      'Instrumental Core Reservoir': { large: 'C320', small: 'C540' },
      'Vital Core Reservoir': { large: 'C540', small: 'C320' }
    };
    
    const composition = gasMapping[siteName];
    if (composition) {
      return `${composition.large} + ${composition.small}`;
    }
    return 'Unknown';
  }

  private applyFilters(): void {
    let filtered = [...(this.results || [])];

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
    this.manualSites = [];
    this.errorMessage = '';
    this.gasSites = [];
    this.iskMap = {};
  }

  addManualSite(): void {
    const newSite: ManualSiteEntry = {
      id: 'manual_' + Date.now(),
      sigId: '',
      selectedReservoir: '',
      isEditing: true
    };
    this.manualSites.push(newSite);
  }

  updateManualSiteReservoir(siteId: string, reservoir: string): void {
    const site = this.manualSites.find(s => s.id === siteId);
    if (site) {
      site.selectedReservoir = reservoir;
      this.computeGasSitesAndIsk();
    }
  }

  removeManualSite(siteId: string): void {
    this.manualSites = this.manualSites.filter(s => s.id !== siteId);
    this.computeGasSitesAndIsk();
  }

  loadSampleData(): void {
    this.probeText = `HTX-750	Cosmic Signature			0,0%	11,16 AU
PBJ-525	Cosmic Signature			0,0%	15,45 AU
GCX-866    Cosmic Signature    Gas Site    Ordinary Perimeter Reservoir    100.0%    7.67 AU
VVA-330 Cosmic Signature	Gas Site    Sizeable Perimeter Reservoir    100.0%    4.38 AU`;
  }

  getGasSites(): ParsedSiteResult[] {
    // Return cached combined list
    return this.gasSites;
  }

  getRandomISK(): string {
    // Deprecated - kept for compatibility
    return '0.0';
  }

  // Stable ISK getter for a specific signature id
  getRandomISKFor(sigId: string): string {
    if (!sigId) {
      return '0.0';
    }
    if (!this.iskMap[sigId]) {
      const iskValues = ['20.1', '24.8', '18.3', '32.1', '15.7'];
      this.iskMap[sigId] = iskValues[Math.floor(Math.random() * iskValues.length)];
    }
    return this.iskMap[sigId];
  }

  private computeGasSitesAndIsk(): void {
    // Parsed gas sites (exclude unscanned signatures)
    const parsedGasSites = this.filteredResults.filter(result => result.siteName !== 'Cosmic Signature');

    // Manual sites mapped to ParsedSiteResult; ensure sigId is unique (use manual.id when sigId empty)
    const manualGasSites = this.manualSites
      .filter(manual => manual.selectedReservoir)
      .map(manual => ({
        sigId: manual.sigId && manual.sigId.trim().length > 0 ? manual.sigId : manual.id,
        siteName: manual.selectedReservoir
      }));

    this.gasSites = [...parsedGasSites, ...manualGasSites];

    // Ensure iskMap has entries for all current sites
    for (const site of this.gasSites) {
      if (!this.iskMap[site.sigId]) {
        const iskValues = ['20.1', '24.8', '18.3', '32.1', '15.7'];
        this.iskMap[site.sigId] = iskValues[Math.floor(Math.random() * iskValues.length)];
      }
    }

    // Remove stale isk entries for removed sites
    const validKeys = new Set(this.gasSites.map(s => s.sigId));
    for (const key of Object.keys(this.iskMap)) {
      if (!validKeys.has(key)) {
        delete this.iskMap[key];
      }
    }
  }
}
