using System.ComponentModel.DataAnnotations;

public class Donator
{
    [Key]
    public required string CPF { get; set; }

    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string PhoneNumber { get; set; }
    public required string Password { get; set; }

    public string SocialName { get; set; }

    public ICollection<Donation> Donations { get; set; }
}
