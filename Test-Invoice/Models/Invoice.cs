using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Test_Invoice.Models
{
    [Table("Invoice")]
    public partial class Invoice
    {
        public Invoice()
        {
            InvoiceDetails = new HashSet<InvoiceDetail>();
        }

        [Key]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        [Column(TypeName = "money")]
        public decimal TotalItbis { get; set; }
        [Column(TypeName = "money")]
        public decimal SubTotal { get; set; }
        [Column(TypeName = "money")]
        public decimal Total { get; set; }

        [ForeignKey("CustomerId")]
        [InverseProperty("Invoices")]
        public virtual Customer Customer { get; set; } = null!;
        [InverseProperty("Customer")]
        public virtual ICollection<InvoiceDetail> InvoiceDetails { get; set; }
    }
}
