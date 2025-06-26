using System.Collections.Generic;

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
                var parts = line.Trim().Split(' ');
                if (parts.Length >= 2)
                {
                    list.Add(new ParsedCloudResult { SigId = parts[0], CloudName = parts[1] });
                }
            }
            return list;
        }
    }
}
