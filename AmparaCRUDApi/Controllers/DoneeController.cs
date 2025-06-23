using Microsoft.AspNetCore.Mvc;
using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace AmparaCRUDApi.Controllers
{
    [Route("api/donee")]
    [ApiController]
    public class DoneeController : Controller
    {
        private readonly ApplicationDbContext dbContext;

        public DoneeController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [Authorize(Roles = "donator,donee")]
        [HttpGet]
        public IActionResult GetAllDonees()
        {
            var donees = dbContext.Donees
                .Select(d => new { d.InstitutionName, d.CNPJ })
                .ToList();

            return Ok(donees);
        }

        [Authorize(Roles = "donator,donee")]
        [HttpGet("getbycnpj")]
        public IActionResult GetDoneeByCnpj([FromQuery] CnpjRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var donee = dbContext.Donees.FirstOrDefault(d => d.CNPJ == model.Cnpj);
            if (donee == null)
                return NotFound();

            return Ok(new
            {
                donee.CNPJ,
                donee.InstitutionName,
                donee.InstitutionType,
                donee.Email,
                donee.PhoneNumber,
                donee.RepresentativeName,
                donee.FavoriteColor
            });
        }

        [HttpPost("signupdonee")]
        public IActionResult AddDonee(AddDoneeDTO addDoneeDTO)
        {
            if (dbContext.Donees.Any(d => d.CNPJ == addDoneeDTO.CNPJ))
                return BadRequest("CNPJ já cadastrado.");

            bool emailExists = dbContext.Donees.Any(d => d.Email == addDoneeDTO.Email)
                            || dbContext.Donators.Any(d => d.Email == addDoneeDTO.Email);
            if (emailExists)
                return BadRequest("E-mail já cadastrado.");

            bool phoneExists = dbContext.Donees.Any(d => d.PhoneNumber == addDoneeDTO.PhoneNumber)
                            || dbContext.Donators.Any(d => d.PhoneNumber == addDoneeDTO.PhoneNumber);
            if (phoneExists)
                return BadRequest("Telefone já cadastrado.");

            var doneeEntity = new Donee()
            {
                CNPJ = addDoneeDTO.CNPJ,
                InstitutionName = addDoneeDTO.InstitutionName,
                InstitutionType = addDoneeDTO.InstitutionType,
                Email = addDoneeDTO.Email,
                PhoneNumber = addDoneeDTO.PhoneNumber,
                RepresentativeName = addDoneeDTO.RepresentativeName,
                FavoriteColor = addDoneeDTO.FavoriteColor,
                Password = BCrypt.Net.BCrypt.HashPassword(addDoneeDTO.Password),
            };

            dbContext.Donees.Add(doneeEntity);
            dbContext.SaveChanges();

            return Ok("Donatário criado com sucesso.");
        }

        [Authorize(Roles = "donee")]
        [HttpPut("cnpj")]
        public IActionResult UpdateDoneeByCnpj([FromQuery] CnpjRequestModel model, [FromBody] UpdateDoneeDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var donee = dbContext.Donees.FirstOrDefault(d => d.CNPJ == model.Cnpj);
            if (donee == null)
                return NotFound();

            donee.InstitutionName = dto.InstitutionName;
            donee.InstitutionType = dto.InstitutionType;
            donee.Email = dto.Email;
            donee.PhoneNumber = dto.PhoneNumber;
            donee.RepresentativeName = dto.RepresentativeName;

            if (!string.IsNullOrWhiteSpace(dto.Password))
                donee.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            dbContext.SaveChanges();
            return Ok("Donee atualizado com sucesso.");
        }

        [Authorize(Roles = "donee")]
        [HttpDelete("cnpj")]
        public IActionResult DeleteDoneeByCnpj([FromQuery] CnpjRequestModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var donee = dbContext.Donees.FirstOrDefault(d => d.CNPJ == model.Cnpj);
            if (donee == null)
                return NotFound();

            var donations = dbContext.Donations.Where(d => d.DoneeCnpj == model.Cnpj).ToList();
            foreach (var donation in donations)
            {
                donation.DoneeNameSnapshot = donee.InstitutionName;
            }

            dbContext.Donees.Remove(donee);
            dbContext.SaveChanges();

            return Ok("Donatário deletado com sucesso.");
        }
    }
}
