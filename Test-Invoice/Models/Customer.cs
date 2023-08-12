using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Test_Invoice.Models
{
    public partial class Customer
    {
        public Customer()
        {
            Invoices = new HashSet<Invoice>();
        }

        [Key]
        public int Id { get; set; }
        [StringLength(70)]
        public string CustName { get; set; } = null!;
        [StringLength(120)]
        public string Adress { get; set; } = null!;
        [Required]
        public bool? Status { get; set; }
        public int CustomerTypeId { get; set; }

        [ForeignKey("CustomerTypeId")]
        [InverseProperty("Customers")]
        public virtual CustomerType CustomerType { get; set; } = null!;
        [InverseProperty("Customer")]
        public virtual ICollection<Invoice> Invoices { get; set; }
    }
}
