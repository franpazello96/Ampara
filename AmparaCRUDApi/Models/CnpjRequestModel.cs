using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models
{
    public class CnpjRequestModel
    {
        [Required]
        [RegularExpression(@"^\d{2}.\d{3}.\d{3}/\d{4}-\d{2}$", ErrorMessage = "CNPJ deve seguir o formato 00.000.000/0000-00")]
        public string Cnpj { get; set; }
    }
}
