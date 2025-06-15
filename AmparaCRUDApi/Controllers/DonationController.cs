using AmparaCRUDApi.Data;
using AmparaCRUDApi.Models;
using AmparaCRUDApi.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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
        public IActionResult FoodDonation(DonationDTO dto)
        {
            var nameSnapshot = dbContext.Donators
                .Where(x => x.CPF == dto.DonatorCpf)
                .Select(x => x.Name)
                .FirstOrDefault();

            var institutionSnapshot = dbContext.Donees
                .Where(x => x.CNPJ == dto.DoneeCnpj)
                .Select(x => x.InstitutionName)
                .FirstOrDefault();

            var donationEntity = new Donation
            {
                DonationType = dto.DonationType,
                Quantity = dto.Quantity,
                Amount = dto.Amount,
                Description = dto.Description,
                Recurrence = dto.Recurrence,
                TimeRecurrence = dto.TimeRecurrence,
                DonatorCpf = dto.DonatorCpf,
                DonatorCpfSnapshot = dto.DonatorCpf,
                DonatorNameSnapshot = nameSnapshot,
                DoneeCnpj = dto.DoneeCnpj,
                DoneeNameSnapshot = institutionSnapshot,
                Date = dto.Date
            };

            dbContext.Donations.Add(donationEntity);
            dbContext.SaveChanges();
            return Ok(donationEntity);
        }

        [HttpPost("moneydonation")]
        public IActionResult MoneyDonation(DonationDTO dto)
        {
            var nameSnapshot = dbContext.Donators
                .Where(x => x.CPF == dto.DonatorCpf)
                .Select(x => x.Name)
                .FirstOrDefault();

            var institutionSnapshot = dbContext.Donees
                .Where(x => x.CNPJ == dto.DoneeCnpj)
                .Select(x => x.InstitutionName)
                .FirstOrDefault();

            var donationEntity = new Donation
            {
                DonationType = dto.DonationType,
                Quantity = dto.Quantity,
                Amount = dto.Amount,
                Description = dto.Description,
                Recurrence = dto.Recurrence,
                TimeRecurrence = dto.TimeRecurrence,
                DonatorCpf = dto.DonatorCpf,
                DonatorCpfSnapshot = dto.DonatorCpf,
                DonatorNameSnapshot = nameSnapshot,
                DoneeCnpj = dto.DoneeCnpj,
                DoneeNameSnapshot = institutionSnapshot,
                Date = dto.Date
            };

            dbContext.Donations.Add(donationEntity);
            dbContext.SaveChanges();
            return Ok(donationEntity);
        }

        [HttpGet("bydonator/{cpf}")]
        public IActionResult GetByDonator(string cpf)
        {
            var donations = (from d in dbContext.Donations
                             join i in dbContext.Donees on d.DoneeCnpj equals i.CNPJ into di
                             from i in di.DefaultIfEmpty()
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
                                 DoneeName = i != null ? i.InstitutionName : null,
                                 DoneeNameSnapshot = d.DoneeNameSnapshot // ✅ incluído aqui
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
            donation.DonationType = dto.DonationType;
            donation.Description = dto.Description;
            donation.Date = dto.Date;
            donation.DonatorCpf = dto.DonatorCpf;
            donation.DoneeCnpj = dto.DoneeCnpj;

            dbContext.SaveChanges();
            return Ok(donation);
        }

        [HttpGet("recurring/bydonee")]
        public IActionResult GetRecurringDonationsByDonee([FromQuery] string cnpj)
        {
            if (string.IsNullOrEmpty(cnpj))
                return BadRequest("CNPJ não informado.");

            var recurring = dbContext.Donations
                .Where(d => d.Recurrence == true && d.DoneeCnpj == cnpj)
                .Select(d => new
                {
                    DonatorName = d.DonatorNameSnapshot,
                    DonatorCpf = d.DonatorCpfSnapshot,
                    Frequency = d.TimeRecurrence,
                    DonationType = d.DonationType,
                    Amount = d.DonationType == "Dinheiro" ? d.Amount : null,
                    QuantityKg = d.DonationType == "Alimentos" ? d.Quantity : null
                })
                .ToList();

            return Ok(recurring);
        }

    }
}
