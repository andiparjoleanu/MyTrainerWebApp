using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyTrainer.Models
{
    public class BilateralExercisesHistory
    {
        public string UserId { get; set; }
        public string ExerciseId { get; set; }
        public DateTime Date { get; set; }
        public History History { get; set; }
        public int LeftSideReps { get; set; }
        public int RightSideReps { get; set; }
    }
}
