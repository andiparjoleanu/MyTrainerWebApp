using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MyTrainer.ViewModels
{
    public class RegisterVM
    {
        public string Username { get; set; }

        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Compare("Password",
            ErrorMessage = "Parolele nu se potrivesc")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
