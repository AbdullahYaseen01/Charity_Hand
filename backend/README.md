# Charity Hand Backend (.NET Framework + C# + SQL Server)

This backend uses only:
- .NET Framework (Web API 2)
- C#
- SQL Server

## Folder Structure

- `CharityHand.Api/Controllers/CasesController.cs`
- `CharityHand.Api/Data/CasesRepository.cs`
- `CharityHand.Api/Models/*.cs`
- `database/charityhand.sql`

## Setup Steps

1. Open SQL Server Management Studio and run `database/charityhand.sql`.
2. Create an ASP.NET Web Application (.NET Framework 4.8) project named `CharityHand.Api`.
3. Copy files from `backend/CharityHand.Api` into that project.
4. Ensure `Web.config` connection string points to your SQL Server.
5. Run the API on `http://localhost:5050`.

## API Endpoints

- `GET /api/cases?category=&city=` returns verified cases
- `POST /api/cases` submits a new request
- `POST /api/cases/donation` records a donation
