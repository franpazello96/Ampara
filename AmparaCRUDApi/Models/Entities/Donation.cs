using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models.Entities
{
    public class Donation
    {
        [Key]
        public int Id { get; set; }
        public required string DonationType { get; set; }
        public int Quantity { get; set; } 
        public decimal Price { get; set; }
        public string Description { get; set; }
        public bool Recurrence { get; set; }
        public string TimeRecurrence { get; set; }
        public DateTime Time { get; set; } = DateTime.UtcNow;
    }
}
