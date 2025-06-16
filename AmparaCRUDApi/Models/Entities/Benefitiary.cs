using System.ComponentModel.DataAnnotations;

public class Benefitiary
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    public string? CPF { get; set; }
    public string? CNPJ { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }

    public string? DoneeCnpj { get; set; }
    public Donee? Donee { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
