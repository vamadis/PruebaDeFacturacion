using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Test_Invoice.Models
{
    public partial class CustomerType
    {
        public CustomerType()
        {
            Customers = new HashSet<Customer>();
        }

        [Key]
        public int Id { get; set; }
        [StringLength(70)]
        public string Description { get; set; } = null!;

        [InverseProperty("CustomerType")]
        public virtual ICollection<Customer> Customers { get; set; }
    }
}
