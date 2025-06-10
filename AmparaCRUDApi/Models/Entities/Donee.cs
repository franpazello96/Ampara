using System.ComponentModel.DataAnnotations;

public class Donee
{
    [Key]
    public required string CNPJ { get; set; }

    public required string InstitutionName { get; set; }
    public required string InstitutionType { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required string RepresentativeName { get; set; }
    public required string Password { get; set; }

    // RELAÇÃO REVERSA
    public ICollection<Donation> DonationsReceived { get; set; }
    public ICollection<Buys> Purchases { get; set; }
    public ICollection<Benefitiary> Benefitiaries { get; set; }
}
