namespace AmparaCRUDApi.Models.Entities
{
    public class DailyDonationTotals
    {
        public DateTime Day { get; set; }
        public decimal TotalAmount { get; set; }
        public string DoneeCnpj { get; set; }
    }
}
