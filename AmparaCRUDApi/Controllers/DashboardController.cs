using AmparaCRUDApi.Data;
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

        [HttpGet("reciveddonation")]
        public IActionResult GetAllDailyTotals([FromQuery] string doneeCnpj)
        {
            var totals = dbContext.DailyDonationTotals
                .Where(x => x.DoneeCnpj == doneeCnpj)
                .OrderBy(x => x.Day)
                .ToList();

            return Ok(totals);
        }

        [HttpGet("expenses")]
        public async Task<IActionResult> GetExpenses([FromQuery] string doneeCnpj)
        {
            var totals = await dbContext.DailyExpensesTotals
                .Where(x => x.DoneeCnpj == doneeCnpj)
                .OrderBy(x => x.Day)
                .ToListAsync();

            return Ok(totals);
        }
    }
}
