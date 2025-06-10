using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AmparaCRUDApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCleanMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ... (código de CreateTable para Benefitiaries, Buys, Donations, Donators, Donees permanece o mesmo) ...

            migrationBuilder.CreateTable(
                name: "Benefitiaries",
                columns: table => new
                {
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CPF = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CNPJ = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Benefitiaries", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "Buys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                          .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StoreName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CNPJ = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buys", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Donations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                          .Annotation("SqlServer:Identity", "1, 1"),
                    DonationType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Recurrence = table.Column<bool>(type: "bit", nullable: true),
                    TimeRecurrence = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Donators",
                columns: table => new
                {
                    CPF = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donators", x => x.CPF);
                });

            migrationBuilder.CreateTable(
                name: "Donees",
                columns: table => new
                {
                    CNPJ = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    InstitutionName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InstitutionType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RepresentativeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donees", x => x.CNPJ);
                });

            // View para total de doações diárias
            migrationBuilder.Sql(@"
                CREATE VIEW vw_DailyDonationTotals AS
                SELECT 
                    CAST([Date] AS DATE) AS Day,
                    SUM([Amount]) AS TotalAmount
                FROM Donations
                WHERE [Amount] IS NOT NULL AND [DonationType] = 'Dinheiro'
                GROUP BY CAST([Date] AS DATE)
            ");

            // ADICIONADO: View para total de despesas diárias
            migrationBuilder.Sql(@"
                CREATE VIEW vw_DailyExpensesTotals AS
                SELECT 
                    CAST([Date] AS DATE) AS Day,
                    SUM([Price]) AS TotalAmount
                FROM Buys
                GROUP BY CAST([Date] AS DATE)
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ADICIONADO: Drop da view de despesas
            migrationBuilder.Sql(@"
                IF OBJECT_ID('vw_DailyExpensesTotals', 'V') IS NOT NULL
                    DROP VIEW vw_DailyExpensesTotals;
            ");

            migrationBuilder.Sql(@"
                IF OBJECT_ID('vw_DailyDonationTotals', 'V') IS NOT NULL
                    DROP VIEW vw_DailyDonationTotals;
            ");

            migrationBuilder.DropTable(name: "Benefitiaries");
            migrationBuilder.DropTable(name: "Buys");
            migrationBuilder.DropTable(name: "Donations");
            migrationBuilder.DropTable(name: "Donators");
            migrationBuilder.DropTable(name: "Donees");
        }
    }
}