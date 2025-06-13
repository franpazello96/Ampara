using AmparaCRUDApi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmparaCRUDApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Donator> Donators { get; set; }
        public DbSet<Donee> Donees { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<DailyDonationTotals> DailyDonationTotals { get; set; }
        public DbSet<DailyExpensesTotals> DailyExpensesTotals { get; set; }
        public DbSet<Buys> Buys { get; set; }
        public DbSet<Benefitiary> Benefitiaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // RELACIONAMENTO Donation → Donator
            modelBuilder.Entity<Donation>()
                .HasOne(d => d.Donator)
                .WithMany(d => d.Donations)
                .HasForeignKey(d => d.DonatorCpf)
                .OnDelete(DeleteBehavior.SetNull);

            // RELACIONAMENTO Donation → Donee
            modelBuilder.Entity<Donation>()
                .HasOne(d => d.Donee)
                .WithMany(o => o.DonationsReceived)
                .HasForeignKey(d => d.DoneeCnpj)
                .OnDelete(DeleteBehavior.Restrict);

            // RELACIONAMENTO Buys → Donee
            modelBuilder.Entity<Buys>()
                .HasOne(b => b.Donee)
                .WithMany(o => o.Purchases)
                .HasForeignKey(b => b.DoneeCnpj)
                .OnDelete(DeleteBehavior.Restrict);

            // RELACIONAMENTO Benefitiary → Donee
            modelBuilder.Entity<Benefitiary>()
                .HasOne(b => b.Donee)
                .WithMany(o => o.Benefitiaries)
                .HasForeignKey(b => b.DoneeCnpj)
                .OnDelete(DeleteBehavior.Restrict);

            // VIEW vw_DailyDonationTotals
            modelBuilder.Entity<DailyDonationTotals>()
                .HasNoKey()
                .ToView("vw_DailyDonationTotals")
                .Property(p => p.TotalAmount)
                .HasColumnType("decimal(18,2)")
                .HasPrecision(18, 2);

            // VIEW vw_DailyExpensesTotals
            modelBuilder.Entity<DailyExpensesTotals>()
                .HasNoKey()
                .ToView("vw_DailyExpensesTotals")
                .Property(p => p.TotalAmount)
                .HasColumnType("decimal(18,2)")
                .HasPrecision(18, 2);
        }
    }
}
