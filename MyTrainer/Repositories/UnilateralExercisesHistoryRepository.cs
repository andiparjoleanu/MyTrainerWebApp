using MyTrainer.Context;
using MyTrainer.IRepositories;
using MyTrainer.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTrainer.Repositories
{
    public class UnilateralExercisesHistoryRepository : BaseRepository<UnilateralExercisesHistory>, IUnilateralExercisesHistoryRepository
    {
        public UnilateralExercisesHistoryRepository(MyTrainerDbContext context) : base(context) { }
    }
}
