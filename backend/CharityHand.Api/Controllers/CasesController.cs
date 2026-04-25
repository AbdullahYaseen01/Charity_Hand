using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using CharityHand.Api.Data;
using CharityHand.Api.Models;

namespace CharityHand.Api.Controllers
{
    [RoutePrefix("api/cases")]
    public class CasesController : ApiController
    {
        private readonly CasesRepository _repository;

        public CasesController()
        {
            _repository = new CasesRepository();
        }

        [HttpGet]
        [Route("")]
        public IEnumerable<CaseRequest> GetCases([FromUri] string category = "", [FromUri] string city = "")
        {
            return _repository.GetVerifiedCases(category, city);
        }

        [HttpPost]
        [Route("")]
        public IHttpActionResult SubmitCase([FromBody] CaseRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            var createdId = _repository.InsertCase(request);
            return Content(HttpStatusCode.Created, new { id = createdId, message = "Case request submitted." });
        }

        [HttpPost]
        [Route("donation")]
        public IHttpActionResult SubmitDonation([FromBody] DonationRequest request)
        {
            if (request == null || request.Amount < 100)
            {
                return BadRequest("Donation amount must be at least 100.");
            }

            _repository.InsertDonation(request);
            return Ok(new { message = "Donation recorded." });
        }
    }
}
