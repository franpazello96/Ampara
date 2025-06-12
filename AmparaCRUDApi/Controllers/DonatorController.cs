using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmparaCRUDApi.Controllers
{
    [Route("api/donator")]
    [ApiController]
    public class DonatorController : Controller
    {
        private readonly ApplicationDbContext dbContext;
        public DonatorController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllDonators()
        {
            var allDonators = dbContext.Donators.ToList();
            return Ok(allDonators);
        }

        [HttpGet("cpf/{cpf}")]
        public IActionResult GetDonatorByCpf(string cpf)
        {
            var donatorCpf = dbContext.Donators.FirstOrDefault(d => d.CPF == cpf);
            return donatorCpf is null ? NotFound() : Ok(donatorCpf);
        }

        [HttpPost("signupdonator")]
        public IActionResult AddDonator([FromBody] AddDonatorDTO addDonatorDTO)
        {
            if (dbContext.Donators.Any(d => d.CPF == addDonatorDTO.CPF))
                return BadRequest("CPF already registered");

            var donatorEntity = new Donator()
            {
                CPF = addDonatorDTO.CPF,
                Name = addDonatorDTO.Name,
                Email = addDonatorDTO.Email,
                PhoneNumber = addDonatorDTO.PhoneNumber,
                Password = BCrypt.Net.BCrypt.HashPassword(addDonatorDTO.Password)
            };

            dbContext.Donators.Add(donatorEntity);
            dbContext.SaveChanges();

            return Ok("Donator successfully created.");
        }

        [HttpPut("cpf/{cpf}")]
        public IActionResult UpdateDonator(string cpf, [FromBody] UpdateDonatorDTO dto)
        {
            var donator = dbContext.Donators.FirstOrDefault(d => d.CPF == cpf);
            if (donator == null)
                return NotFound("Doador não encontrado.");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, donator.Password))
                return Unauthorized("Senha atual incorreta.");

            donator.Name = dto.Name;
            donator.Email = dto.Email;
            donator.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrEmpty(dto.NewPassword))
            {
                if (dto.NewPassword != dto.ConfirmPassword)
                    return BadRequest("Nova senha e confirmação não coincidem.");

                donator.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            }

            dbContext.SaveChanges();
            return Ok(donator);
        }




        [HttpDelete("cpf/{cpf}")]
        public IActionResult DeleteDonator(string cpf)
        {
            var donator = dbContext.Donators.FirstOrDefault(d => d.CPF == cpf);
            if (donator == null) return NotFound();

            dbContext.Donators.Remove(donator);
            dbContext.SaveChanges();
            return Ok(donator);
        }
    }
}
