using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace CloudHufferApi.Services
{
    public class ProbeTextParserService : IProbeTextParserService
    {
        public List<ParsedCloudResult> Parse(string probeText)
        {
            var list = new List<ParsedCloudResult>();
            if (string.IsNullOrWhiteSpace(probeText)) return list;
            var lines = probeText.Split('\n');
            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                if (string.IsNullOrWhiteSpace(trimmed)) continue;
                // Split by tab or 2+ spaces
                var parts = Regex.Split(trimmed, "\t+| {2,}");
                if (parts.Length < 2) continue;
                var sigId = parts[0];
                // Find the first non-empty field after sigId
                string? siteName = null;
                for (int i = 1; i < parts.Length; i++)
                {
                    if (!string.IsNullOrWhiteSpace(parts[i]))
                    {
                        siteName = parts[i].Trim();
                        break;
                    }
                }
                if (!string.IsNullOrWhiteSpace(sigId) && !string.IsNullOrWhiteSpace(siteName))
                {
                    list.Add(new ParsedCloudResult { SigId = sigId, CloudName = siteName });
                }
            }
            return list;
        }
    }
}
