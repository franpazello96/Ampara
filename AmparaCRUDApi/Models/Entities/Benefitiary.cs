using System.ComponentModel.DataAnnotations;

namespace AmparaCRUDApi.Models.Entities
{
	public class Benefitiary
	{
		[Key]
		public required string Name { get; set; }

		public string? CPF { get; set; }
		public string? CNPJ { get; set; }
		public string? Email { get; set; }
		public string? PhoneNumber { get; set; }
	}
}
