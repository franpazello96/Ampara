using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using AmparaCRUDApi.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace AmparaCRUDApi.Controllers
{   //localhost:xxxxx/api/donator
    [Route("api/[controller]")]
    [ApiController]
    public class DonatorController : Controller
    {
        // Constructor to connect to the database from ApplicationDbContext
        private readonly ApplicationDbContext dbContext;
        public DonatorController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        //Reading the table
        [HttpGet]
        public IActionResult GetAllDonators()
        {
            var allDonators = dbContext.Donators.ToList();

            return Ok(allDonators);
        }

        [HttpGet]
        [Route("cpf/{cpf}")]
        public IActionResult GetDonatorByCpf(string cpf)
        {
            var donatorCpf = dbContext.Donators.Find(cpf);

            if (donatorCpf is null)
            {
                return NotFound();
            }

            return Ok(donatorCpf);
        }

        [HttpPost("signupdonator")]
        public IActionResult AddDonator(AddDonatorDTO addDonatorDTO)
        {
            bool cpfExists = dbContext.Donators.Any(d => d.CPF == addDonatorDTO.CPF);
            if (cpfExists)
            {
                return BadRequest("CPF já cadastrado no sistema");
            }
            
                //DTO (Data Transfer Object) is getting the object from the Class Donator, configuring it, and now we create the variables in the "constructor".
                var donatorEntity = new Donator()
                {
                    CPF = addDonatorDTO.CPF,
                    Name = addDonatorDTO.Name,
                    Email = addDonatorDTO.Email,
                    PhoneNumber = addDonatorDTO.PhoneNumber,
                    Password = addDonatorDTO.Password
                };

            //Add the data in the class Donators
            dbContext.Donators.Add(donatorEntity);

            //EF requires to save the changes before return
            dbContext.SaveChanges();

            //Return the POST operation
            return Ok(donatorEntity);
        }

        [HttpPut]
        [Route("cpf/{cpf}")]
        public IActionResult UpdateDonator(string cpf, UpdateDonatorDTO updateDonatorDTO)
        {
            var donator = dbContext.Donators.Find(cpf);
            if (donator == null)
            {
                return NotFound();
            }

            donator.Name = updateDonatorDTO.Name;
            donator.PhoneNumber = updateDonatorDTO.PhoneNumber;
            donator.Email = updateDonatorDTO.Email;
            donator.Password = updateDonatorDTO.Password;

            dbContext.SaveChanges();
            return Ok(donator);
        }

        [HttpDelete]
        [Route("cpf/{cpf}")]
        public IActionResult DeleteDonator(string cpf)
        {
            var donator = dbContext.Donators.Find(cpf);

            if (donator == null)
            {
                return NotFound();
            }

            dbContext.Donators.Remove(donator);
            dbContext.SaveChanges();
            return Ok(donator);
        }
    }
}
