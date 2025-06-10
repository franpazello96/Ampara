namespace AmparaCRUDApi.Models
{
    public class DonationDTO
    {
        public int Id { get; set; }
        public required string DonationType { get; set; }
        public int? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public string Description { get; set; }
        public bool Recurrence { get; set; }
        public string? TimeRecurrence { get; set; }
        public DateTime Date { get; set; }

        public string DonatorCpf { get; set; }
        public string DoneeCnpj { get; set; }

    }
}
