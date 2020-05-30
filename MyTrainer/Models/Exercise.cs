using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyTrainer.Models
{
    public class Exercise
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Script { get; set; }
        public ICollection<History> Histories { get; set; }
    }
}
