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
        public IActionResult DoDonation(DonationDTO DonationDTO)
        {
            var donationEntity = new Donation()
            {
                Id = DonationDTO.Id,
                DonationType = DonationDTO.DonationType,
                Quantity = DonationDTO.Quantity,
                Description = DonationDTO.Description,
                Recurrence = DonationDTO.Recurrence,
                TimeRecurrence = DonationDTO.TimeRecurrence
            };

            dbContext.Donations.Add(donationEntity);
            dbContext.SaveChanges();
            return Ok(donationEntity);
        }
    }
}
