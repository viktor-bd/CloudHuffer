using Microsoft.AspNetCore.Mvc;
using CloudHufferApi.Services;
using System.Collections.Generic;

namespace CloudHufferApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProbeTextParserController : ControllerBase
    {
        private readonly IProbeTextParserService _parserService;

        public ProbeTextParserController(IProbeTextParserService parserService)
        {
            _parserService = parserService;
        }

        [HttpPost("parse")]
        public ActionResult<List<ParsedSiteResult>> Parse([FromBody] ProbeTextInput input)
        {
            if (string.IsNullOrWhiteSpace(input?.ProbeText))
                return BadRequest("Probe text is required.");

            var result = _parserService.Parse(input.ProbeText);
            return Ok(result);
        }
    }

    public class ProbeTextInput
    {
        public required string ProbeText { get; set; }
    }
}
