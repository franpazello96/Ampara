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
        public IActionResult GetAllDailyTotals()
        {
            var totals = dbContext.DailyDonationTotals.OrderBy(x => x.Day).ToList();

            return Ok(totals);
        }

        [HttpGet("expenses")]
        public async Task<IActionResult> GetExpenses()
        {
            var totals = await dbContext.DailyExpensesTotals
                                       .OrderBy(x => x.Day)
                                       .ToListAsync();
            return Ok(totals);
        }
    }
}