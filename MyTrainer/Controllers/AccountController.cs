using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyTrainer.Models;
//using MyTrainer.Services;
using MyTrainer.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace MyTrainer.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromForm] LoginVM loginVM)
        {
            var user = await _userManager.FindByNameAsync(loginVM.Username);

            if (user != null && await _userManager.CheckPasswordAsync(user, loginVM.Password))
            {
                await _signInManager.SignInAsync(user, false);
                ViewBag.Username = loginVM.Username;
            } 
            else 
            {
                TempData["TrySignInErrorMessage"] = "Eroare de autentificare";
                return RedirectToAction("Login");
            }

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterVM registerVM)
        {
            IdentityResult result = null;
            var user = await _userManager.FindByNameAsync(registerVM.Username);

            if (user != null)
            {
                TempData["RegisterErrorMessage"] = "Utilizatorul exista deja";
                return RedirectToAction("Register");
            }

            user = new User
            {
                Id = Guid.NewGuid().ToString(),
                UserName = registerVM.Username
            };

            result = await _userManager.CreateAsync(user, registerVM.Password);

            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, false);
                ViewBag.Username = user.UserName;
            }
            else
            {
                TempData["RegisterErrorMessage"] = result.Errors.Select(e => e.Description);
                return RedirectToAction("Register");
            }

            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            ViewBag.Username = "Guest";
            return RedirectToAction("Login");
        }
    }
}