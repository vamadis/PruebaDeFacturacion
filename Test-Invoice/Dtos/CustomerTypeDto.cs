using System.ComponentModel.DataAnnotations;

namespace Test_Invoice.Dtos
{
    public class CustomerTypeDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = null!;
    }
}
