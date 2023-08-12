using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Test_Invoice.Dtos;
using Test_Invoice.Models;

namespace Test_Invoice.Controllers
{
    public class CustomerTypeController : Controller
    {
        private readonly TestInvoine _testInvoine;
        public CustomerTypeController(TestInvoine testInvoine)
        {
            _testInvoine = testInvoine;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<JsonResult> GetCustomerType()
        {
            var datos = await _testInvoine.CustomerTypes.Select(x => new CustomerTypeDto
            { 
                Id = x.Id,
                Description = x.Description

            }).ToListAsync();

            return Json(datos);
        }

        [HttpPost]
        public async Task<IActionResult> PostCustomerType()
        {
            using var reader = new StreamReader(Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var parameters = JsonSerializer.Deserialize<Dictionary<string, string>>(requestBody);

            var data = new CustomerType
            { 
                 Description = parameters!["Description"]
            };
            
            await _testInvoine.CustomerTypes.AddAsync(data);

            await  _testInvoine.SaveChangesAsync();

            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> PutCustomerType()
        {
            using var reader = new StreamReader(Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var parameters = JsonSerializer.Deserialize<Dictionary<string, string>>(requestBody);

            var data = await _testInvoine.CustomerTypes.FirstOrDefaultAsync(x => x.Id == Convert.ToInt32(parameters!["Id"]));

             data!.Description = parameters!["Description"];

             _testInvoine.CustomerTypes.Update(data!);

             await _testInvoine.SaveChangesAsync();

             return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> EliminateCustomerType()
        {
            using var reader = new StreamReader(Request.Body);
            var requestBody = await reader.ReadToEndAsync();
            var parameters = JsonSerializer.Deserialize<Dictionary<string, string>>(requestBody);

            var customerType  = await _testInvoine.CustomerTypes.Where(x => x.Id == Convert.ToInt32(parameters!["Id"])).FirstAsync();
             _testInvoine.CustomerTypes.Remove(customerType);
            await _testInvoine.SaveChangesAsync();

            return Ok();
        }

    }
}
