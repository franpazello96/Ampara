using AmparaCRUDApi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

public class Donation
{
    [Key]
    public int Id { get; set; }

    public required string DonationType { get; set; }
    public int? Quantity { get; set; }

    [Precision(18, 2)]
    public decimal? Amount { get; set; }

    public string Description { get; set; }
    public bool Recurrence { get; set; }
    public string? TimeRecurrence { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;

    // RELACIONAMENTOS
    [Required]
    public string DonatorCpf { get; set; }
    public Donator Donator { get; set; }

    [Required]
    public string DoneeCnpj { get; set; }
    public Donee Donee { get; set; }
}
