using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AmparaCRUDApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateDailyDonationView : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.RenameColumn(
                name: "Time",
                table: "Donations",
                newName: "Date");


            migrationBuilder.Sql(@"
                CREATE VIEW vw_DailyDonationTotals AS
                SELECT 
                    CAST([Date] AS DATE) AS Day,
                    SUM([Amount]) AS TotalAmount
                FROM Donations
                GROUP BY CAST([Date] AS DATE)
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "Donations");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Donations",
                newName: "Time");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Donations",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.Sql("DROP VIEW vw_DailyDonationTotals");

        }
    }
}
