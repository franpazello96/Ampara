namespace AmparaCRUDApi.Models
{
    public class TransactionDTO
    {
        public string Type { get; set; }             
        public string Category { get; set; }          
        public string? Description { get; set; }       
        public int? Quantity { get; set; }             
        public decimal? Amount { get; set; }           
        public DateTime Date { get; set; }             
        public string? TimeRecurrence { get; set; }    
    }
}
