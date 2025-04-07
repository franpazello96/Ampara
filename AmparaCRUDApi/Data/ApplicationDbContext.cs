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
    }
}
