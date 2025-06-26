namespace CloudHufferApi.Services
{
    public interface IProbeTextParserService
    {
        /// <summary>
        /// Parses probe scanner text and extracts cloud names and signature IDs.
        /// </summary>
        /// <param name="probeText">Raw text from the probe scanner.</param>
        /// <returns>List of parsed clouds with sig IDs and names.</returns>
        List<ParsedCloudResult> Parse(string probeText);
    }

    public class ParsedCloudResult
    {
        public string SigId { get; set; }
        public string CloudName { get; set; }
    }
}
