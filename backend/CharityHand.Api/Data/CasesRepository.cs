using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using CharityHand.Api.Models;

namespace CharityHand.Api.Data
{
    public class CasesRepository
    {
        public IEnumerable<CaseRequest> GetVerifiedCases(string category, string city)
        {
            var records = new List<CaseRequest>();

            using (var connection = SqlConnectionFactory.Create())
            using (var command = connection.CreateCommand())
            {
                command.CommandText = @"
                    SELECT
                        Id, FullName, Age, City, Category, ProblemDescription,
                        AmountNeeded, ContactInfo, ImageUrl, Status, CreatedAt
                    FROM dbo.CaseRequests
                    WHERE Status = 'Verified'
                      AND (@Category = '' OR LOWER(Category) = LOWER(@Category))
                      AND (@City = '' OR LOWER(City) = LOWER(@City))
                    ORDER BY CreatedAt DESC;";

                command.Parameters.AddWithValue("@Category", category ?? string.Empty);
                command.Parameters.AddWithValue("@City", city ?? string.Empty);

                connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        records.Add(MapCase(reader));
                    }
                }
            }

            return records;
        }

        public int InsertCase(CaseRequest request)
        {
            using (var connection = SqlConnectionFactory.Create())
            using (var command = connection.CreateCommand())
            {
                command.CommandText = @"
                    INSERT INTO dbo.CaseRequests
                        (FullName, Age, City, Category, ProblemDescription, AmountNeeded, ContactInfo, ImageUrl, Status, CreatedAt)
                    VALUES
                        (@FullName, @Age, @City, @Category, @ProblemDescription, @AmountNeeded, @ContactInfo, @ImageUrl, 'Pending', GETUTCDATE());
                    SELECT CAST(SCOPE_IDENTITY() AS INT);";

                command.Parameters.AddWithValue("@FullName", request.FullName ?? string.Empty);
                command.Parameters.AddWithValue("@Age", request.Age);
                command.Parameters.AddWithValue("@City", request.City ?? string.Empty);
                command.Parameters.AddWithValue("@Category", request.Category ?? string.Empty);
                command.Parameters.AddWithValue("@ProblemDescription", request.ProblemDescription ?? string.Empty);
                command.Parameters.AddWithValue("@AmountNeeded", request.AmountNeeded);
                command.Parameters.AddWithValue("@ContactInfo", request.ContactInfo ?? string.Empty);
                command.Parameters.AddWithValue("@ImageUrl", request.ImageUrl ?? string.Empty);

                connection.Open();
                return (int)command.ExecuteScalar();
            }
        }

        public void InsertDonation(DonationRequest request)
        {
            using (var connection = SqlConnectionFactory.Create())
            using (var command = connection.CreateCommand())
            {
                command.CommandText = @"
                    INSERT INTO dbo.Donations (CaseName, Amount, Message, DonatedAt)
                    VALUES (@CaseName, @Amount, @Message, GETUTCDATE());";

                command.Parameters.AddWithValue("@CaseName", request.CaseName ?? string.Empty);
                command.Parameters.AddWithValue("@Amount", request.Amount);
                command.Parameters.AddWithValue("@Message", request.Message ?? string.Empty);

                connection.Open();
                command.ExecuteNonQuery();
            }
        }

        private static CaseRequest MapCase(SqlDataReader reader)
        {
            return new CaseRequest
            {
                Id = Convert.ToInt32(reader["Id"]),
                FullName = Convert.ToString(reader["FullName"]),
                Age = Convert.ToInt32(reader["Age"]),
                City = Convert.ToString(reader["City"]),
                Category = Convert.ToString(reader["Category"]),
                ProblemDescription = Convert.ToString(reader["ProblemDescription"]),
                AmountNeeded = Convert.ToDecimal(reader["AmountNeeded"]),
                ContactInfo = Convert.ToString(reader["ContactInfo"]),
                ImageUrl = Convert.ToString(reader["ImageUrl"]),
                Status = Convert.ToString(reader["Status"]),
                CreatedAt = Convert.ToDateTime(reader["CreatedAt"])
            };
        }
    }
}
