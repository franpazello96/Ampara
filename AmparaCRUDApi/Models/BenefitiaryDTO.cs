namespace AmparaCRUDApi.Models
{
    public class BenefitiaryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? CPF { get; set; }
        public string? CNPJ { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
