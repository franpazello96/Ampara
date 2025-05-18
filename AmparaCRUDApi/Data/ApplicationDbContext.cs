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
        public DbSet<Buys>Buys { get; set; }
        public DbSet<Benefitiary> Benefitiaries { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Donation>()
                .Property(d => d.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<DailyDonationTotals>()
                .HasNoKey()
                .ToView("vw_DailyDonationTotals");
        }
    }
}
