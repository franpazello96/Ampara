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

            var buy = new Buys
            {
                Date = dto.Date,
                Type = dto.Type, 
                StoreName = dto.StoreName,
                CNPJ = dto.CNPJ,
                Price = dto.Price,
                Description = dto.Description,
                Quantity = dto.Quantity
            };

            dbContext.Buys.Add(buy);
            await dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBuyById), new { id = buy.Id }, buy);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBuyById(int id)
        {
            var buy = await dbContext.Buys.FindAsync(id);
            if (buy == null) return NotFound();

            return Ok(buy);
        }
    }
}