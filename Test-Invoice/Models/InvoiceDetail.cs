using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Test_Invoice.Models
{
    [Table("InvoiceDetail")]
    public partial class InvoiceDetail
    {
        [Key]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int Qty { get; set; }
        [Column(TypeName = "money")]
        public decimal Price { get; set; }
        [Column(TypeName = "money")]
        public decimal TotalItbis { get; set; }
        [Column(TypeName = "money")]
        public decimal SubTotal { get; set; }
        [Column(TypeName = "money")]
        public decimal Total { get; set; }

        [ForeignKey("CustomerId")]
        [InverseProperty("InvoiceDetails")]
        public virtual Invoice Customer { get; set; } = null!;
    }
}
