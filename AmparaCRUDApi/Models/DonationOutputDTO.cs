namespace AmparaCRUDApi.Models
{
    public class DonationOutputDTO
    {
        public string Type { get; set; }
        public string Category { get; set; }
        public decimal? FoodQuantity { get; set; } // Matches your snippet's field name
        public decimal? Amount { get; set; }       // Matches your snippet's field name
        public DateTime Date { get; set; }
        public string? TimeRecurrence { get; set; }

    }
}
