using Microsoft.AspNetCore.Mvc;
using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

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

        [Authorize(Roles = "donee")]
        [HttpGet]
        public IActionResult GetAllDonees()
        {
            try
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
            catch (System.Exception ex)
            {
                // Log do erro para debug
                System.Console.WriteLine($"[GetAllDonees Error] {ex.Message}");
                return StatusCode(500, "Erro ao recuperar instituições.");
            }
        }

        [HttpPost("signupdonee")]
        public IActionResult AddDonee(AddDoneeDTO addDoneeDTO)
        {
            try
            {
                if (addDoneeDTO == null)
                    return BadRequest("Dados da instituição inválidos.");

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
                    Password = BCrypt.Net.BCrypt.HashPassword(addDoneeDTO.Password),
                };

                dbContext.Donees.Add(doneeEntity);
                dbContext.SaveChanges();

                return Ok("Donee successfully created.");
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"[AddDonee Error] {ex.Message}");
                return StatusCode(500, "Erro ao cadastrar instituição.");
            }
        }
    }
}
