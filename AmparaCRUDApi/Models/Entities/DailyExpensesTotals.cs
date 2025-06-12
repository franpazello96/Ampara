namespace AmparaCRUDApi.Models.Entities
{
    public class DailyExpensesTotals
    {
        public DateTime Day { get; set; }
        public decimal TotalAmount { get; set; }
        public string DoneeCnpj { get; set; }
    }
}
