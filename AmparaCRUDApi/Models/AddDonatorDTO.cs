using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models
{
    public class AddDonatorDTO
    {
        [Required]
        public string CPF { get; set; }

        [Required]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
