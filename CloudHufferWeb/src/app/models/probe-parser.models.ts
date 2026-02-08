export interface ParsedSiteResult {
  sigId: string;
  siteName: string;
}

export interface ManualSiteEntry {
  id: string;
  sigId: string;
  selectedReservoir: string;
  isEditing: boolean;
}

export interface ProbeTextInput {
  probeText: string;
}