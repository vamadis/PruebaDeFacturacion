using Test_Invoice.Models;

namespace Test_Invoice.Dtos
{
    public class InvoiceDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public decimal TotalItbis { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Total { get; set; }
        public List<InvoinceDetailDto>? InvoiceDetail { get; set; }
    }
}
