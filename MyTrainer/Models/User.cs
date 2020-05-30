using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyTrainer.Models
{
    public class User : IdentityUser
    {
        //public string Id { get; set; }
        //public string UserName { get; set; }
        //public string PasswordHash { get; set; }
        public ICollection<History> Histories { get; set; }
    }
}
