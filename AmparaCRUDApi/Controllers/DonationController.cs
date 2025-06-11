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
                Quantity = 0,
                Amount = DonationDTO.Amount,
                Description = DonationDTO.Description,
                Recurrence = DonationDTO.Recurrence,
                TimeRecurrence = DonationDTO.TimeRecurrence,
                DonatorCpf = DonationDTO.DonatorCpf,
                DoneeCnpj = DonationDTO.DoneeCnpj,
                Date = DonationDTO.Date
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
                TimeRecurrence = DonationDTO.TimeRecurrence,
                DonatorCpf = DonationDTO.DonatorCpf,
                DoneeCnpj = DonationDTO.DoneeCnpj,
                Date = DonationDTO.Date
            };

            dbContext.Donations.Add(donationEntity);
            dbContext.SaveChanges();
            return Ok(donationEntity);
        }

    }
}