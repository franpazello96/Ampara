using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models.Entities
{
    public class Benefitiary
    {
        [Key]
        public required string Name { get; set; }

        public required string CPF { get; set; }
        public required string CNPJ { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
    }
}
