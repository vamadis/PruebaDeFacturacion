using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Test_Invoice.Models;

namespace Test_Invoice.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly TestInvoine _testInvoine;

        public HomeController(ILogger<HomeController> logger,TestInvoine testInvoine)
        {
            _logger = logger;
            _testInvoine = testInvoine; 
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}