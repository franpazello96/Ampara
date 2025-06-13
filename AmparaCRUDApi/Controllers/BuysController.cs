using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using AmparaCRUDApi.Models.Entities;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Roles = "donee")]
        [HttpPost("addbuy")]
        public async Task<IActionResult> AddBuy([FromBody] AddBuysDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (dto == null)
                    return BadRequest("Dados da compra não fornecidos.");

                var buy = new Buys
                {
                    Date = dto.Date,
                    Type = dto.Type,
                    StoreName = dto.StoreName,
                    CNPJ = dto.CNPJ,
                    Price = dto.Price,
                    Description = dto.Description,
                    Quantity = dto.Quantity,
                    DoneeCnpj = dto.DoneeCnpj
                };

                dbContext.Buys.Add(buy);
                await dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBuyById), new { id = buy.Id }, buy);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AddBuy Error] {ex.Message}");
                return StatusCode(500, "Erro ao registrar compra.");
            }
        }

        [Authorize(Roles = "donee")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBuyById(int id)
        {
            try
            {
                var buy = await dbContext.Buys.FindAsync(id);
                if (buy == null)
                    return NotFound("Compra não encontrada.");

                return Ok(buy);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetBuyById Error] {ex.Message}");
                return StatusCode(500, "Erro ao buscar compra.");
            }
        }
    }
}