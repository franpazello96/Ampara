using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace AmparaCRUDApi.Models.Entities
{
    public class Donation
    {
        [Key]
        public int Id { get; set; }
        public required string DonationType { get; set; }
        public int Quantity { get; set; }
        [Precision(18,2)]
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public bool Recurrence { get; set; }
        public string TimeRecurrence { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
