using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmparaCRUDApi.Models.Entities
{
    public class SendDonation
    {
        [Key]
        public int ID { get; set; }
        public decimal amount { get; set; }

    }
}
