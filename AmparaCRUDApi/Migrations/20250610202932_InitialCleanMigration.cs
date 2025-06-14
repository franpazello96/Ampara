using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AmparaCRUDApi.Migrations
{
    public partial class InitialCleanMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.CreateTable(
                name: "Benefitiaries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CPF = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CNPJ = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DoneeCnpj = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Benefitiaries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Benefitiaries_Donees_DoneeCnpj",
                        column: x => x.DoneeCnpj,
                        principalTable: "Donees",
                        principalColumn: "CNPJ",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Buys",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StoreName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CNPJ = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    DoneeCnpj = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BenefitiaryId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Buys_Donees_DoneeCnpj",
                        column: x => x.DoneeCnpj,
                        principalTable: "Donees",
                        principalColumn: "CNPJ",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Buys_Benefitiaries_BenefitiaryId",
                        column: x => x.BenefitiaryId,
                        principalTable: "Benefitiaries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
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
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Recurrence = table.Column<bool>(type: "bit", nullable: false),
                    TimeRecurrence = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DonatorCpf = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DoneeCnpj = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DonatorCpfSnapshot = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DonatorNameSnapshot = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Donations_Donators_DonatorCpf",
                        column: x => x.DonatorCpf,
                        principalTable: "Donators",
                        principalColumn: "CPF",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Donations_Donees_DoneeCnpj",
                        column: x => x.DoneeCnpj,
                        principalTable: "Donees",
                        principalColumn: "CNPJ",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Benefitiaries_DoneeCnpj",
                table: "Benefitiaries",
                column: "DoneeCnpj");

            migrationBuilder.CreateIndex(
                name: "IX_Buys_DoneeCnpj",
                table: "Buys",
                column: "DoneeCnpj");

            migrationBuilder.CreateIndex(
                name: "IX_Buys_BenefitiaryId",
                table: "Buys",
                column: "BenefitiaryId");

            migrationBuilder.CreateIndex(
                name: "IX_Donations_DonatorCpf",
                table: "Donations",
                column: "DonatorCpf");

            migrationBuilder.CreateIndex(
                name: "IX_Donations_DoneeCnpj",
                table: "Donations",
                column: "DoneeCnpj");

            migrationBuilder.Sql(@"
                CREATE VIEW vw_DailyDonationTotals AS
                SELECT 
                    CAST([Date] AS DATE) AS Day,
                    SUM([Amount]) AS TotalAmount,
                    [DoneeCnpj]
                FROM Donations
                WHERE [Amount] IS NOT NULL AND [DonationType] = 'Dinheiro'
                GROUP BY CAST([Date] AS DATE), [DoneeCnpj]
            ");

            migrationBuilder.Sql(@"
                CREATE VIEW vw_DailyExpensesTotals AS
                SELECT 
                    CAST([Date] AS DATE) AS Day,
                    SUM([Price]) AS TotalAmount,
                    [DoneeCnpj]
                FROM Buys
                GROUP BY CAST([Date] AS DATE), [DoneeCnpj]
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "Benefitiaries");
            migrationBuilder.DropTable(name: "Buys");
            migrationBuilder.DropTable(name: "Donations");
            migrationBuilder.DropTable(name: "Donators");
            migrationBuilder.DropTable(name: "Donees");

            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_DailyExpensesTotals;");
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_DailyDonationTotals;");
        }
    }
}
