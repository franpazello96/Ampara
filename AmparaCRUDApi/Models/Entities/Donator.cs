namespace AmparaCRUDApi.Models.Entities
{
    public class Donator
    {
        public required string CPF { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Password { get; set; }
    }
}
