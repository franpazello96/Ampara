using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace AmparaCRUDApi.Controllers
{
    [Route("api/transactions")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public TransactionController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [Authorize(Roles = "donee")]
        [HttpGet("getalltransactions")]
        public async Task<IActionResult> GetAllTransactions([FromQuery] string doneeCnpj)
        {
            if (string.IsNullOrWhiteSpace(doneeCnpj))
                return BadRequest("O CNPJ do donatário é obrigatório.");

            try
            {
                var donations = await dbContext.Donations
                    .Where(d => d.DoneeCnpj == doneeCnpj)
                    .Select(d => new TransactionDTO
                    {
                        Type = "Entrada",
                        Category = d.DonationType,
                        Quantity = d.Quantity,
                        Amount = d.Amount,
                        Description = d.Description,
                        TimeRecurrence = d.TimeRecurrence,
                        Date = d.Date
                    })
                    .ToListAsync();

                var buys = await dbContext.Buys
                    .Where(b => b.DoneeCnpj == doneeCnpj)
                    .Select(b => new TransactionDTO
                    {
                        Type = "Saída",
                        Category = b.Type,
                        Quantity = b.Quantity,
                        Amount = b.Price,
                        Description = b.Description,
                        TimeRecurrence = null,
                        Date = b.Date
                    })
                    .ToListAsync();

                var allTransactions = donations
                    .Concat(buys)
                    .OrderByDescending(t => t.Date)
                    .ToList();

                return Ok(allTransactions);
            }
            catch (System.Exception ex)
            {
                // Log para ajudar no debug
                System.Console.WriteLine($"[GetAllTransactions Error] {ex.Message}");
                return StatusCode(500, "Erro ao recuperar transações.");
            }
        }
    }
}
