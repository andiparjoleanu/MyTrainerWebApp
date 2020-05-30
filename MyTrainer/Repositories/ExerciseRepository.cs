using MyTrainer.Context;
using MyTrainer.IRepositories;
using MyTrainer.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTrainer.Repositories
{
    public class ExerciseRepository : BaseRepository<Exercise>, IExerciseRepository
    {
        public ExerciseRepository(MyTrainerDbContext context) : base(context) { }
    }
}
