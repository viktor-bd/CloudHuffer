namespace CloudHufferApi.Services
{
    public interface IProbeTextParserService
    {
        /// <summary>
        /// Parses probe scanner text and extracts site names and signature IDs.
        /// </summary>
        /// <param name="probeText">Raw text from the probe scanner.</param>
        /// <returns>List of parsed sites with sig IDs and names.</returns>
        List<ParsedSiteResult> Parse(string probeText);
    }

    public class ParsedSiteResult
    {
        public required string SigId { get; set; }
        public required string SiteName { get; set; }
    }
}
