using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models
{
    public class AddBenefitiaryDTO
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string CPF { get; set; }

        [Required]
        public string CNPJ { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PhoneNumber { get; set; }
    }
}
