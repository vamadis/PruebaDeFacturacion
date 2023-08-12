using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Test_Invoice.Dtos;
using Test_Invoice.Models;

namespace Test_Invoice.Controllers
{
    public class CustomerController : Controller
    {
        private readonly TestInvoine _testInvoine;
        public CustomerController(TestInvoine testInvoine)
        {
            _testInvoine = testInvoine;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> GetCustomerType()
        {

            var CustomerTypes = await _testInvoine.CustomerTypes
                .AsNoTracking().Select(x => new CustomerTypeDto
            {
                Id = x.Id,
                Description = x.Description

            }).ToListAsync();

            var Customers = await _testInvoine.Customers.AsNoTracking()
                .Include(x => x.CustomerType).Select(x => new CustomerDto
            {
                Id = x.Id,
                CustName = x.CustName,
                Adress = x.Adress,
                Status = x.Status,
                Description = x.CustomerType.Description,
            }).ToListAsync();

            var jsonData = new { CustomerTypes = CustomerTypes, Customers = Customers };

            return Json(jsonData);
        }

        [HttpPost]
        public async Task<IActionResult> PostCustomer()
        {
            using var reader = new StreamReader(Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var parameters = JsonSerializer.Deserialize<Dictionary<string, string>>(requestBody);

            var data = new Customer
            {
                CustName = parameters!["CustName"],
                Adress = parameters!["Adress"],
                Status = Convert.ToBoolean(parameters!["Status"]),
                CustomerTypeId = Convert.ToInt32(parameters!["CustomerTypeId"])
            };

            await _testInvoine.Customers.AddAsync(data);
            await _testInvoine.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> PutCustomer()
        {
            using var reader = new StreamReader(Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var parameters = JsonSerializer.Deserialize<Dictionary<string, string>>(requestBody);

            var data = await _testInvoine.Customers.AsNoTracking().FirstOrDefaultAsync(x => x.Id == Convert.ToInt32(parameters!["Id"]));

            data!.CustName = parameters!["CustName"];
            data!.Adress = parameters!["Adress"];
            data!.Status = Convert.ToBoolean(parameters!["Status"]);
            data!.CustomerTypeId = Convert.ToInt32(parameters!["CustomerTypeId"]);

            _testInvoine.Customers.Update(data!);

            await _testInvoine.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> EliminateCustomer()
        {
            using var reader = new StreamReader(Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var parameters = JsonSerializer.Deserialize<Dictionary<string, string>>(requestBody);

            var customer = await _testInvoine.Customers.AsNoTracking().Where(x => x.Id == Convert.ToInt32(parameters!["Id"])).FirstAsync();
            _testInvoine.Customers.Remove(customer);
            await _testInvoine.SaveChangesAsync();

            return Ok();
        }
    }
}
