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

        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetDonatorProfile()
        {
            var cpf = User.FindFirst("cpf")?.Value;
            if (cpf == null) return Unauthorized("Invalid or Not Found token.");

            var donator = dbContext.Donators.FirstOrDefault(d => d.CPF == cpf);
            return donator == null ? NotFound("Donator not found.") : Ok(donator);
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

        [HttpPut("update")]
        [Authorize]
        public IActionResult UpdateDonator([FromBody] UpdateDonatorDTO updateDonatorDTO)
        {
            var cpf = User.FindFirst("cpf")?.Value;
            if (cpf == null) return Unauthorized("Invalid or Not Found token,");

            var donator = dbContext.Donators.FirstOrDefault(d => d.CPF == cpf);
            if (donator == null) return NotFound("Donator not found.");
            if (donator.Password != updateDonatorDTO.Password) return Unauthorized("Wrong password.");
            donator.Name = updateDonatorDTO.Name;
            donator.Email = updateDonatorDTO.Email;
            donator.PhoneNumber = updateDonatorDTO.PhoneNumber;

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
