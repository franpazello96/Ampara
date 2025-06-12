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
                DonationType = DonationDTO.DonationType,
                Quantity = DonationDTO.Quantity, 
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
                Quantity = DonationDTO.Quantity,
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

        [HttpGet("bydonator/{cpf}")]
        public IActionResult GetByDonator(string cpf)
        {
            var donations = (from d in dbContext.Donations
                             join i in dbContext.Donees
                                 on d.DoneeCnpj equals i.CNPJ into di
                             from i in di.DefaultIfEmpty() // LEFT JOIN
                             where d.DonatorCpf == cpf
                             orderby d.Date descending
                             select new DonationWithInstitutionDTO
                             {
                                 Id = d.Id,
                                 DonationType = d.DonationType,
                                 Quantity = d.Quantity,
                                 Amount = d.Amount,
                                 Description = d.Description,
                                 Recurrence = d.Recurrence,
                                 TimeRecurrence = d.TimeRecurrence,
                                 Date = d.Date,
                                 DonatorCpf = d.DonatorCpf,
                                 DoneeCnpj = d.DoneeCnpj,
                                 DoneeName = i != null ? i.InstitutionName : null
                             }).ToList();

            return Ok(donations);
        }

        [HttpPut("update/{id}")]
        public IActionResult UpdateRecurringDonation(int id, [FromBody] DonationDTO dto)
        {
            var donation = dbContext.Donations.FirstOrDefault(d => d.Id == id);

            if (donation == null)
                return NotFound("Doação não encontrada.");

            if (!donation.Recurrence)
                return BadRequest("Apenas doações recorrentes podem ser atualizadas por aqui.");

            donation.Amount = dto.Amount;
            donation.Quantity = dto.Quantity;
            donation.Recurrence = dto.Recurrence;
            donation.TimeRecurrence = dto.Recurrence ? dto.TimeRecurrence : null;

            // Atualize o restante também, mesmo que não mude
            donation.DonationType = dto.DonationType;
            donation.Description = dto.Description;
            donation.Date = dto.Date;
            donation.DonatorCpf = dto.DonatorCpf;
            donation.DoneeCnpj = dto.DoneeCnpj;

            dbContext.SaveChanges();

            return Ok(donation);
        }



    }
}