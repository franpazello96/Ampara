using Microsoft.AspNetCore.Mvc;
using AmparaCRUDApi.Data;
using System.Linq;
using AmparaCRUDApi.Models.Entities;
using AmparaCRUDApi.Models;

namespace AmparaCRUDApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BenefitiaryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BenefitiaryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetBenefitiaries([FromQuery] string? name)
        {
            var query = _context.Benefitiaries.AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(b => b.Name.Contains(name));
            }

            var result = query
                .Select(b => new
                {
                    id = b.CPF ?? b.CNPJ,
                    name = b.Name
                })
                .ToList();

            return Ok(result);
        }

        [HttpPost]
        public IActionResult AddBenefitiary(AddBenefitiaryDTO dto)
        {
            bool exists = _context.Benefitiaries.Any(b =>
                (!string.IsNullOrEmpty(dto.CPF) && b.CPF == dto.CPF) ||
                (!string.IsNullOrEmpty(dto.CNPJ) && b.CNPJ == dto.CNPJ));

            if (exists)
            {
                return BadRequest("CPF ou CNPJ já cadastrado.");
            }

            var entity = new Benefitiary
            {
                Name = dto.Name,
                CPF = dto.CPF,
                CNPJ = dto.CNPJ,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber
            };

            _context.Benefitiaries.Add(entity);
            _context.SaveChanges();

            return Ok(entity);
        }
    }
}
