namespace AmparaCRUDApi.Models
{
    public class AddDonatorDTO
    {
        public required string CPF { get; set; }

        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Password { get; set; }
    }
}
