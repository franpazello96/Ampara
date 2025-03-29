namespace AmparaCRUDApi.Models
{
    public class UpdateDonatorDTO
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Password { get; set; }
    }
}
