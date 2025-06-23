namespace AmparaCRUDApi.Models
{
    public class UpdateDonatorDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string CurrentPassword { get; set; } 
        public string SocialName { get; set; }
        public string? NewPassword { get; set; }    
        public string? ConfirmPassword { get; set; } 
    }

}
