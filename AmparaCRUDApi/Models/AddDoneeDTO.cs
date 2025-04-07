using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models
{
    public class AddDoneeDTO
    {
        [Required]
        public string CNPJ {  get; set; }
        [Required]
        public string InstitutionName { get; set; }
        [Required]
        public string InstitutionType { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string RepresentativeName { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
