using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using AmparaCRUDApi.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AmparaCRUDApi.Controllers
{
    [Route("api/buys")]
    [ApiController]
    public class BuysController : Controller
    {
        private readonly ApplicationDbContext dbContext;

        public BuysController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("addbuy")]
        public async Task<IActionResult> AddBuy([FromBody] AddBuysDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string? nameSnapshot = null;
            string? docSnapshot = null;

            if (dto.BenefitiaryId.HasValue)
            {
                var benef = await dbContext.Benefitiaries.FindAsync(dto.BenefitiaryId.Value);
                if (benef != null)
                {
                    nameSnapshot = benef.Name;
                    docSnapshot = benef.CPF ?? benef.CNPJ;
                }
            }

            var buy = new Buys
            {
                Date = dto.Date,
                Type = dto.Type,
                StoreName = dto.StoreName,
                CNPJ = dto.CNPJ,
                Price = dto.Price,
                Description = dto.Description,
                Quantity = dto.Quantity,
                DoneeCnpj = dto.DoneeCnpj,
                BenefitiaryId = dto.BenefitiaryId,
                BenefitiaryNameSnapshot = nameSnapshot,
                BenefitiaryDocumentSnapshot = docSnapshot
            };

            dbContext.Buys.Add(buy);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBuyById), new { id = buy.Id }, dto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBuyById(int id)
        {
            var buy = await dbContext.Buys
                .Include(b => b.Benefitiary)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (buy == null) return NotFound();

            var dto = new AddBuysDTO
            {
                Id = buy.Id,
                Date = buy.Date,
                Type = buy.Type,
                StoreName = buy.StoreName,
                CNPJ = buy.CNPJ,
                Price = buy.Price,
                Description = buy.Description,
                Quantity = buy.Quantity,
                DoneeCnpj = buy.DoneeCnpj,
                BenefitiaryId = buy.BenefitiaryId
            };

            return Ok(dto);
        }
    }
}
