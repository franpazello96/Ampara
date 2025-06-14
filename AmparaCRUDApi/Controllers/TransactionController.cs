using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
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

        [HttpGet("getalltransactions")]
        public async Task<IActionResult> GetAllTransactions([FromQuery] string doneeCnpj)
        {
            if (string.IsNullOrWhiteSpace(doneeCnpj))
                return BadRequest("O CNPJ do donatário é obrigatório.");

            var donations = await (
                from d in dbContext.Donations
                join donator in dbContext.Donators
                    on d.DonatorCpf equals donator.CPF into donatorJoin
                from donator in donatorJoin.DefaultIfEmpty()
                where d.DoneeCnpj == doneeCnpj
                select new TransactionDTO
                {
                    Type = "Entrada",
                    Category = d.DonationType,
                    Quantity = d.Quantity,
                    Amount = d.Amount,
                    Description = d.Description,
                    TimeRecurrence = d.TimeRecurrence,
                    Date = d.Date,
                    DonatorCpf = d.DonatorCpfSnapshot ?? d.DonatorCpf ?? "",
                    DonatorName = d.DonatorNameSnapshot ?? donator.Name ?? "Anônimo",
                    BeneficiaryName = null,
                    BeneficiaryDocument = null
                }).ToListAsync();

            var buys = await dbContext.Buys
                .Include(b => b.Benefitiary)
                .Where(b => b.DoneeCnpj == doneeCnpj)
                .Select(b => new TransactionDTO
                {
                    Type = "Saída",
                    Category = b.Type,
                    Quantity = b.Quantity,
                    Amount = b.Price,
                    Description = b.Description,
                    TimeRecurrence = null,
                    Date = b.Date,
                    DonatorName = null,
                    DonatorCpf = null,
                    BeneficiaryName = b.BenefitiaryNameSnapshot ?? b.Benefitiary.Name,
                    BeneficiaryDocument = b.BenefitiaryDocumentSnapshot ?? b.Benefitiary.CPF ?? b.Benefitiary.CNPJ
                })
                .ToListAsync();

            var all = donations.Concat(buys).OrderByDescending(t => t.Date).ToList();

            return Ok(all);
        }
    }
}
