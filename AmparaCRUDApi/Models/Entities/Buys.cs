using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmparaCRUDApi.Models.Entities
{
    public class Buys
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string StoreName { get; set; }

        [Required]
        public string Description { get; set; }




    }
}
