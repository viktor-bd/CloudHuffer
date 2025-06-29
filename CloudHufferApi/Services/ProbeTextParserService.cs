using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace CloudHufferApi.Services
{
    public class ProbeTextParserService : IProbeTextParserService
    {
        public List<ParsedSiteResult> Parse(string probeText)
        {
            var list = new List<ParsedSiteResult>();
            if (string.IsNullOrWhiteSpace(probeText)) return list;
            var lines = probeText.Split('\n');
            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                if (string.IsNullOrWhiteSpace(trimmed)) continue;
                // Extract sigId as the first word (up to first whitespace)
                var firstSpaceIdx = trimmed.IndexOfAny(new[] { ' ', '\t' });
                if (firstSpaceIdx <= 0) continue;
                var sigId = trimmed.Substring(0, firstSpaceIdx).Trim();
                var rest = trimmed.Substring(firstSpaceIdx).TrimStart();
                // Now split the rest by tab or 2+ spaces
                var parts = Regex.Split(rest, "\t+| {2,}");
                // Find the field before the percentage (signal strength)
                int percentIdx = -1;
                for (int i = 0; i < parts.Length; i++)
                {
                    if (Regex.IsMatch(parts[i].Trim(), @"^\d+[.,]??\d*%$"))
                    {
                        percentIdx = i;
                        break;
                    }
                }
                string? siteName = null;
                if (percentIdx > 0)
                {
                    siteName = parts[percentIdx - 1].Trim();
                }
                else
                {
                    // Not fully scanned, fallback to first non-empty field (usually 'Cosmic Signature')
                    for (int i = 0; i < parts.Length; i++)
                    {
                        if (!string.IsNullOrWhiteSpace(parts[i]))
                        {
                            siteName = parts[i].Trim();
                            break;
                        }
                    }
                }
                if (!string.IsNullOrWhiteSpace(sigId) && !string.IsNullOrWhiteSpace(siteName))
                {
                    list.Add(new ParsedSiteResult { SigId = sigId, SiteName = siteName });
                }
            }
            return list;
        }
    }
}
