using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Test_Invoice.Dtos;
using Test_Invoice.Models;

namespace Test_Invoice.Controllers
{
    public class InvoiceController : Controller
    {
        private readonly TestInvoine _testInvoine;
        public InvoiceController(TestInvoine testInvoine)
        {
            _testInvoine = testInvoine;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<JsonResult> GetCustomer()
        {
            var CustomerTypes = await _testInvoine.Customers
                .AsNoTracking().Select(x => new CustomerDto
                {
                    Id = x.Id,
                    CustName = x.CustName,
                }).ToListAsync();

            return Json(CustomerTypes);
        }

        [HttpPost]
        public async Task<IActionResult> postSaveInvoice()
        {
            using var reader = new StreamReader(Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var parameters = Newtonsoft.Json.JsonConvert.DeserializeObject<InvoiceDto>(requestBody);
            var ListInvoiceDetail = new List<InvoiceDetail>();

            using (var transaction = _testInvoine.Database.BeginTransaction())
            {
                try
                {
                    var invoice = new Invoice
                    {
                        CustomerId = parameters!.CustomerId,
                        TotalItbis = parameters!.TotalItbis,
                        SubTotal = parameters!.SubTotal,
                        Total = parameters!.Total,
                    };

                    await _testInvoine.Invoices.AddAsync(invoice);
                    await _testInvoine.SaveChangesAsync();

                    foreach (var item in parameters.InvoiceDetail!)
                    {
                        var invoiceDetail = new InvoiceDetail
                        {
                            CustomerId = parameters.CustomerId,
                            Qty = item.Qty,
                            Price = item.Price,
                            TotalItbis = parameters.TotalItbis,
                            SubTotal = parameters.SubTotal,
                            Total = parameters.Total
                        };
                        ListInvoiceDetail.Add(invoiceDetail);
                    }

                    await _testInvoine.InvoiceDetails.AddRangeAsync(ListInvoiceDetail);

                    await _testInvoine.SaveChangesAsync();

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return NotFound();
                }
            }
            return Ok();
        }
    }
}
