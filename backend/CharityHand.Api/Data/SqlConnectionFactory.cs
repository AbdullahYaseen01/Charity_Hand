using System.Configuration;
using System.Data.SqlClient;

namespace CharityHand.Api.Data
{
    public static class SqlConnectionFactory
    {
        public static SqlConnection Create()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["CharityHandDb"].ConnectionString;
            return new SqlConnection(connectionString);
        }
    }
}
