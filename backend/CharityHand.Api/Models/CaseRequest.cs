using System;

namespace CharityHand.Api.Models
{
    public class CaseRequest
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public string City { get; set; }
        public string Category { get; set; }
        public string ProblemDescription { get; set; }
        public decimal AmountNeeded { get; set; }
        public string ContactInfo { get; set; }
        public string ImageUrl { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
