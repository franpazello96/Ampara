using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models
{
    public class AddBenefitiaryDTO
    {
        [Required]
        public string Name { get; set; }

        public string? CPF { get; set; }
        public string? CNPJ { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? PhoneNumber { get; set; }

        [Required]
        public string DoneeCnpj { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}
