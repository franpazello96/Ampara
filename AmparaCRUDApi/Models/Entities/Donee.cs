using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models.Entities
{
    public class Donee
    {
        [Key]
        public required string CNPJ { get; set; }

        public required string InstitutionName { get; set; }
        public string InstitutionType { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string RepresentativeName { get; set; } 
        public required string Password { get; set; }
    }
}
