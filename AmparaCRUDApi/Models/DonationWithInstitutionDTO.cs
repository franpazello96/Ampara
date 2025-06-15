namespace AmparaCRUDApi.Models
{
    public class DonationWithInstitutionDTO
    {
        public int Id { get; set; }
        public string DonationType { get; set; }
        public int? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public string? Description { get; set; }
        public bool Recurrence { get; set; }
        public string? TimeRecurrence { get; set; }
        public DateTime Date { get; set; }
        public string DonatorCpf { get; set; }
        public string DoneeCnpj { get; set; }

        public string? DoneeName { get; set; } // Nome atual da instituição (se existir)
        public string? DoneeNameSnapshot { get; set; } // Nome fixado no momento da doação ✅
    }
}
