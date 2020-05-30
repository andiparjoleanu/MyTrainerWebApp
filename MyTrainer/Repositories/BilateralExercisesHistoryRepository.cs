using MyTrainer.Context;
using MyTrainer.IRepositories;
using MyTrainer.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTrainer.Repositories
{
    public class BilateralExercisesHistoryRepository : BaseRepository<BilateralExercisesHistory>, IBilateralExercisesHistoryRepository
    {
        public BilateralExercisesHistoryRepository(MyTrainerDbContext context) : base(context) { }
    }
}
