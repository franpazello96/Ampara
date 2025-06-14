using AmparaCRUDApi.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Buys
{
    [Key]
    public int Id { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    public string Type { get; set; }

    [Required]
    public string StoreName { get; set; }

    [Required]
    public string? CNPJ { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [Required]
    public string Description { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public string DoneeCnpj { get; set; }
    public Donee Donee { get; set; }

    public int? BenefitiaryId { get; set; }
    public Benefitiary? Benefitiary { get; set; }

    public string? BenefitiaryNameSnapshot { get; set; }
    public string? BenefitiaryDocumentSnapshot { get; set; }
}
