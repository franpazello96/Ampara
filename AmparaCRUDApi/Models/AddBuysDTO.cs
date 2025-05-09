using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models
{
    public class AddBuysDTO
    {
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string StoreName { get; set; }
        [Required]
        public string Description { get; set; }
    }
}
