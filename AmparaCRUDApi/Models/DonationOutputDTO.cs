namespace AmparaCRUDApi.Models
{
    public class DonationOutputDTO
    {
        public string Type { get; set; }
        public string Category { get; set; }
        public decimal? FoodQuantity { get; set; } 
        public decimal? Amount { get; set; }       
        public DateTime Date { get; set; }
        public string? TimeRecurrence { get; set; }

    }
}
