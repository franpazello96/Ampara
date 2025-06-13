using Microsoft.AspNetCore.Mvc;
using AmparaCRUDApi.Data;
using System.Linq;
using AmparaCRUDApi.Models.Entities;
using AmparaCRUDApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace AmparaCRUDApi.Controllers
{
    [ApiController]
    [Route("api/benefitiary")]
    public class BenefitiaryController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        public BenefitiaryController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [Authorize(Roles = "donee")]
        [HttpGet("bydonee")]
        public ActionResult<List<BenefitiaryDTO>> GetByDonee([FromQuery] CnpjRequestModel cnpjModel)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(cnpjModel?.Cnpj))
                    return BadRequest("CNPJ não informado.");

                var beneficiaries = dbContext.Benefitiaries
                    .Where(b => b.DoneeCnpj.Trim().ToLower() == cnpjModel.Cnpj.Trim().ToLower())
                    .OrderByDescending(b => b.CreatedAt)
                    .Select(b => new BenefitiaryDTO
                    {
                        Id = b.Id,
                        Name = b.Name,
                        Email = b.Email,
                        PhoneNumber = b.PhoneNumber,
                        CPF = b.CPF,
                        CNPJ = b.CNPJ,
                        CreatedAt = b.CreatedAt
                    })
                    .ToList();

                return Ok(beneficiaries);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetByDonee Error] {ex.Message}");
                return StatusCode(500, "Erro interno ao buscar beneficiários.");
            }
        }

        [Authorize(Roles = "donee")]
        [HttpPost("signupbenefitiary")]
        public IActionResult AddBenefitiary(AddBenefitiaryDTO dto)
        {
            try
            {
                if (dto == null)
                    return BadRequest("Dados do beneficiário não informados.");

                if (string.IsNullOrEmpty(dto.CPF) && string.IsNullOrEmpty(dto.CNPJ))
                    return BadRequest("Informe CPF ou CNPJ.");

                if (!string.IsNullOrEmpty(dto.CPF) && !string.IsNullOrEmpty(dto.CNPJ))
                    return BadRequest("Informe apenas CPF ou apenas CNPJ, nunca os dois.");

                bool exists = dbContext.Benefitiaries.Any(b =>
                    (!string.IsNullOrEmpty(dto.CPF) && b.CPF == dto.CPF) ||
                    (!string.IsNullOrEmpty(dto.CNPJ) && b.CNPJ == dto.CNPJ));

                if (exists)
                    return BadRequest("CPF ou CNPJ já cadastrado.");

                var entity = new Benefitiary
                {
                    Name = dto.Name,
                    CPF = dto.CPF,
                    CNPJ = dto.CNPJ,
                    Email = dto.Email,
                    PhoneNumber = dto.PhoneNumber,
                    DoneeCnpj = dto.DoneeCnpj,
                    CreatedAt = dto.CreatedAt
                };

                dbContext.Benefitiaries.Add(entity);
                dbContext.SaveChanges();

                return Ok(entity);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AddBenefitiary Error] {ex.Message}");
                return StatusCode(500, "Erro ao adicionar beneficiário.");
            }
        }

        [Authorize(Roles = "donee")]
        [HttpPut("{id}")]
        public IActionResult UpdateBenefitiary(int id, [FromBody] AddBenefitiaryDTO dto)
        {
            try
            {
                var existing = dbContext.Benefitiaries.FirstOrDefault(b => b.Id == id);
                if (existing == null)
                    return NotFound("Beneficiário não encontrado.");

                existing.Name = dto.Name;
                existing.CPF = string.IsNullOrWhiteSpace(dto.CPF) ? null : dto.CPF;
                existing.CNPJ = string.IsNullOrWhiteSpace(dto.CNPJ) ? null : dto.CNPJ;
                existing.Email = dto.Email;
                existing.PhoneNumber = dto.PhoneNumber;
                existing.DoneeCnpj = dto.DoneeCnpj;

                dbContext.SaveChanges();

                return Ok(existing);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UpdateBenefitiary Error] {ex.Message}");
                return StatusCode(500, "Erro ao atualizar beneficiário.");
            }
        }

        [Authorize(Roles = "donee")]
        [HttpDelete("{id}")]
        public IActionResult DeleteBenefitiary(int id)
        {
            try
            {
                var existing = dbContext.Benefitiaries.FirstOrDefault(b => b.Id == id);
                if (existing == null)
                    return NotFound("Beneficiário não encontrado.");

                dbContext.Benefitiaries.Remove(existing);
                dbContext.SaveChanges();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DeleteBenefitiary Error] {ex.Message}");
                return StatusCode(500, "Erro ao deletar beneficiário.");
            }
        }

        [Authorize(Roles = "donee")]
        [HttpGet("bydocument")]
        public IActionResult GetByDocument([FromQuery] string document)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(document))
                    return BadRequest("Documento não informado.");

                var beneficiary = dbContext.Benefitiaries
                    .FirstOrDefault(b =>
                        (!string.IsNullOrEmpty(b.CPF) && b.CPF == document) ||
                        (!string.IsNullOrEmpty(b.CNPJ) && b.CNPJ == document));

                if (beneficiary == null)
                    return NotFound("Beneficiário não encontrado.");

                var dto = new BenefitiaryDTO
                {
                    Id = beneficiary.Id,
                    Name = beneficiary.Name,
                    Email = beneficiary.Email,
                    PhoneNumber = beneficiary.PhoneNumber,
                    CPF = beneficiary.CPF,
                    CNPJ = beneficiary.CNPJ,
                    CreatedAt = beneficiary.CreatedAt
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GetByDocument Error] {ex.Message}");
                return StatusCode(500, "Erro ao buscar beneficiário por documento.");
            }
        }



    }
}
