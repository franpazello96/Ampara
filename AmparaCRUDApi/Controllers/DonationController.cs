using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using AmparaCRUDApi.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace AmparaCRUDApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationController : Controller
    {
        private readonly ApplicationDbContext dbContext;
        public DonationController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("fooddonation")]
        public IActionResult FoodDonation(DonationDTO DonationDTO)
        {
            var donationEntity = new Donation()
            {
                Id = DonationDTO.Id,
                DonationType = DonationDTO.DonationType,
                Quantity = DonationDTO.Quantity,
                Amount = 0,
                Description = DonationDTO.Description,
                Recurrence = DonationDTO.Recurrence,
                TimeRecurrence = DonationDTO.TimeRecurrence
            };

            dbContext.Donations.Add(donationEntity);
            dbContext.SaveChanges();
            return Ok(donationEntity);
        }

        [HttpPost("moneydonation")]
        public IActionResult MoneyDonation(DonationDTO DonationDTO)
        {
            var donationEntity = new Donation()
            {
                Id = DonationDTO.Id,
                DonationType = DonationDTO.DonationType,
                Quantity = 0,
                Amount = DonationDTO.Amount,
                Description = DonationDTO.Description,
                Recurrence = DonationDTO.Recurrence,
                TimeRecurrence = DonationDTO.TimeRecurrence
            };

            dbContext.Donations.Add(donationEntity);
            dbContext.SaveChanges();
            return Ok(donationEntity);
        }

        [HttpGet("getalltransactions")]
        public IActionResult GetAllTransactions()
        {
            var transactions = dbContext.Donations
                .OrderByDescending(d => d.Date)
                .Select(d => new DonationOutputDTO
                {
                    Type = "Entrada", 
                    Category = d.DonationType == "Alimento" ? "Alimentos" : (d.DonationType == "Dinheiro" ? "Dinheiro" : d.DonationType),
                    FoodQuantity = d.DonationType == "Alimento" ? d.Quantity : null,
                    Amount = d.DonationType == "Dinheiro" ? d.Amount : (d.DonationType == "Alimento" && d.Amount.HasValue ? d.Amount : null), // Handle cases like row 4 in image
                    Date = d.Date, 
                    TimeRecurrence = d.TimeRecurrence 
                })
                .ToList();

            return Ok(transactions);
        }
    }
}
