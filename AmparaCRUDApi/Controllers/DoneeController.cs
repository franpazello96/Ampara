using Microsoft.AspNetCore.Mvc;
using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;


namespace AmparaCRUDApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoneeController : Controller
    {
        private readonly ApplicationDbContext dbContext;
        public DoneeController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult GetAllDonees()
        {
            var donees = dbContext.Donees
                .Select(d => new
                {
                    d.InstitutionName,
                    d.CNPJ
                })
                .ToList();

            return Ok(donees);
        }

        [HttpPost("signupdonee")]
        public IActionResult AddDonee(AddDoneeDTO addDoneeDTO)
        {
            if (dbContext.Donees.Any(d => d.CNPJ == addDoneeDTO.CNPJ))
                return BadRequest("CNPJ já cadastrado");

            var doneeEntity = new Donee()
            {
                CNPJ = addDoneeDTO.CNPJ,
                InstitutionName = addDoneeDTO.InstitutionName,
                InstitutionType = addDoneeDTO.InstitutionType,
                Email = addDoneeDTO.Email,
                PhoneNumber = addDoneeDTO.PhoneNumber,
                RepresentativeName = addDoneeDTO.RepresentativeName,
                Password = BCrypt.Net.BCrypt.HashPassword(addDoneeDTO.Password),
            };

            dbContext.Donees.Add(doneeEntity);
            dbContext.SaveChanges();

            return Ok("Donee successfully created.");
        }

    }
}
