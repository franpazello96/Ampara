using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models
{
    public class AddBuysDTO
    {
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public string StoreName { get; set; }

        public string? CNPJ { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}