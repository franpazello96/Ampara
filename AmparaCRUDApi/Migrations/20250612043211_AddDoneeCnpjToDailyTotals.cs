using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SeuProjeto.Migrations
{
    public partial class AddDoneeCnpjToDailyTotalsProperly : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_DailyDonationTotals;");
            migrationBuilder.Sql("CREATE VIEW vw_DailyDonationTotals AS SELECT Day, TotalAmount, DoneeCnpj FROM DailyDonationTotals;");

            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_DailyExpensesTotals;");
            migrationBuilder.Sql("CREATE VIEW vw_DailyExpensesTotals AS SELECT Day, TotalAmount, DoneeCnpj FROM DailyExpensesTotals;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_DailyDonationTotals;");
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_DailyExpensesTotals;");

            migrationBuilder.DropColumn(
                name: "DoneeCnpj",
                table: "DailyDonationTotals");

            migrationBuilder.DropColumn(
                name: "DoneeCnpj",
                table: "DailyExpensesTotals");
        }
    }
}
