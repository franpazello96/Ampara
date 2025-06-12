using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuProjeto.Migrations
{
    public partial class AddDoneeCnpjToDailyTotalsProperly : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Adiciona a coluna DoneeCnpj às tabelas base
            migrationBuilder.AddColumn<string>(
                name: "DoneeCnpj",
                table: "DailyDonationTotals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DoneeCnpj",
                table: "DailyExpensesTotals",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            // Garante que a view será removida antes de ser criada
            migrationBuilder.Sql(@"
                IF OBJECT_ID('vw_DailyDonationTotals', 'V') IS NOT NULL
                    DROP VIEW vw_DailyDonationTotals;

                CREATE VIEW vw_DailyDonationTotals AS
                SELECT
                    CAST(Date AS DATE) AS Day,
                    SUM(Amount) AS TotalAmount,
                    DoneeCnpj
                FROM Donations
                WHERE Amount IS NOT NULL
                GROUP BY CAST(Date AS DATE), DoneeCnpj;
            ");

            migrationBuilder.Sql(@"
                IF OBJECT_ID('vw_DailyExpensesTotals', 'V') IS NOT NULL
                    DROP VIEW vw_DailyExpensesTotals;

                CREATE VIEW vw_DailyExpensesTotals AS
                SELECT
                    CAST(Date AS DATE) AS Day,
                    SUM(Price) AS TotalAmount,
                    DoneeCnpj
                FROM Buys
                WHERE Price IS NOT NULL
                GROUP BY CAST(Date AS DATE), DoneeCnpj;
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove as views
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_DailyDonationTotals;");
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_DailyExpensesTotals;");

            // Remove as colunas
            migrationBuilder.DropColumn(
                name: "DoneeCnpj",
                table: "DailyDonationTotals");

            migrationBuilder.DropColumn(
                name: "DoneeCnpj",
                table: "DailyExpensesTotals");
        }
    }
}
