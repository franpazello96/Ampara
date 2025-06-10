using System.ComponentModel.DataAnnotations;

public class Donator
{
    [Key]
    public required string CPF { get; set; }

    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required string Password { get; set; }

    // RELAÇÃO REVERSA: Doações feitas por este doador
    public ICollection<Donation> Donations { get; set; }
}
