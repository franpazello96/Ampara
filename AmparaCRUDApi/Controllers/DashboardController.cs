using AmparaCRUDApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace AmparaCRUDApi.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        public DashboardController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [Authorize(Roles = "donee")]
        [HttpGet("reciveddonation")]
        public IActionResult GetAllDailyTotals([FromQuery] string doneeCnpj)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(doneeCnpj))
                    return BadRequest("CNPJ do beneficiário não informado.");

                var totals = dbContext.DailyDonationTotals
                    .Where(x => x.DoneeCnpj == doneeCnpj)
                    .OrderBy(x => x.Day)
                    .ToList();

                return Ok(totals);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetAllDailyTotals Error] {ex.Message}");
                return StatusCode(500, "Erro ao obter as doações diárias.");
            }
        }

        [Authorize(Roles = "donee")]
        [HttpGet("expenses")]
        public async Task<IActionResult> GetExpenses([FromQuery] string doneeCnpj)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(doneeCnpj))
                    return BadRequest("CNPJ do beneficiário não informado.");

                var totals = await dbContext.DailyExpensesTotals
                    .Where(x => x.DoneeCnpj == doneeCnpj)
                    .OrderBy(x => x.Day)
                    .ToListAsync();

                return Ok(totals);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetExpenses Error] {ex.Message}");
                return StatusCode(500, "Erro ao obter as despesas diárias.");
            }
        }
    }
}
