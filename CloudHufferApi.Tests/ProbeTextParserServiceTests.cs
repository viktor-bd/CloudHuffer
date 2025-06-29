using Xunit;
using CloudHufferApi.Services;
using System.Collections.Generic;

namespace CloudHufferApi.Tests
{
    public class ProbeTextParserServiceTests
    {
        private readonly IProbeTextParserService _service = new ProbeTextParserService();

        [Fact]
        public void Parse_ReturnsEmptyList_WhenInputIsNullOrEmpty()
        {
            Assert.Empty(_service.Parse(null));
            Assert.Empty(_service.Parse(""));
        }

        [Fact]
        public void Parse_ParsesSingleRealLine()
        {
            var input = "GCX-866    Cosmic Signature    Gas Site    Ordinary Perimeter Reservoir    100.0%    7.67 AU";
            var result = _service.Parse(input);
            Assert.Single(result);
            Assert.Equal("GCX-866", result[0].SigId);
            Assert.Equal("Ordinary Perimeter Reservoir", result[0].SiteName);
        }

        [Fact]
        public void Parse_ParsesMultipleRealLines()
        {
            var input =
                "HTX-750\tCosmic Signature\t\t\t0,0%\t11,16 AU\n" +
                "PBJ-525\tCosmic Signature\t\t\t0,0%\t15,45 AU\n" +
                "GCX-866    Cosmic Signature    Gas Site    Ordinary Perimeter Reservoir    100.0%    7.67 AU\n" +
                "VVA-330 Cosmic Signature\tGas Site    Sizeable Perimeter Reservoir    100.0%    4.38 AU";
            input = input.Replace("\\t", "\t").Replace("\\n", "\n");
            var result = _service.Parse(input);
            Assert.Equal(4, result.Count);
            Assert.Contains(result, r => r.SigId == "HTX-750" && r.SiteName == "Cosmic Signature");
            Assert.Contains(result, r => r.SigId == "PBJ-525" && r.SiteName == "Cosmic Signature");
            Assert.Contains(result, r => r.SigId == "GCX-866" && r.SiteName == "Ordinary Perimeter Reservoir");
            Assert.Contains(result, r => r.SigId == "VVA-330" && r.SiteName == "Sizeable Perimeter Reservoir");
        }
    }
}
