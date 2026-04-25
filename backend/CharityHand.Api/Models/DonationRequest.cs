namespace CharityHand.Api.Models
{
    public class DonationRequest
    {
        public string CaseName { get; set; }
        public decimal Amount { get; set; }
        public string Message { get; set; }
    }
}
