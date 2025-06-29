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
        {
            var input = "ABC-123 SomeCloud\nDEF-456 AnotherCloud";
            var result = _service.Parse(input);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, c => c.SigId == "ABC-123" && c.CloudName == "SomeCloud");
            Assert.Contains(result, c => c.SigId == "DEF-456" && c.CloudName == "AnotherCloud");
        }
    }
}
