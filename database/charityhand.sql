CREATE DATABASE CharityHandDb;
GO

USE CharityHandDb;
GO

CREATE TABLE dbo.CaseRequests
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(120) NOT NULL,
    Age INT NOT NULL,
    City NVARCHAR(80) NOT NULL,
    Category NVARCHAR(40) NOT NULL,
    ProblemDescription NVARCHAR(1000) NOT NULL,
    AmountNeeded DECIMAL(18,2) NOT NULL,
    ContactInfo NVARCHAR(180) NOT NULL,
    ImageUrl NVARCHAR(500) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.Donations
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CaseName NVARCHAR(120) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Message NVARCHAR(500) NULL,
    DonatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

INSERT INTO dbo.CaseRequests
    (FullName, Age, City, Category, ProblemDescription, AmountNeeded, ContactInfo, ImageUrl, Status)
VALUES
    ('Ahmad Khan', 45, 'Karachi', 'medical', 'Urgent surgery required for heart condition.', 85000, '0300-0000000', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop', 'Verified'),
    ('Fatima Begum', 12, 'Lahore', 'education', 'Student needs school fees and books.', 25000, '0300-0000001', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop', 'Verified'),
    ('Rashid Ali', 38, 'Islamabad', 'food', 'Family of five needs monthly food support.', 15000, '0300-0000002', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=250&fit=crop', 'Verified');
GO
