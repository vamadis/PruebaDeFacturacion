namespace Test_Invoice.Dtos
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public string CustName { get; set; } = null!;
        public string Adress { get; set; } = null!;
        public bool? Status { get; set; }
        public string Description { get; set; } = null!;
    }
}
