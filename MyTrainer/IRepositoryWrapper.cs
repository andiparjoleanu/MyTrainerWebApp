using MyTrainer.IRepositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTrainer
{
    public interface IRepositoryWrapper
    {
        IExerciseRepository ExerciseRepository { get; }
        IHistoryRepository HistoryRepository { get; }
        IUnilateralExercisesHistoryRepository UnilateralExercisesHistoryRepository { get; }
        IBilateralExercisesHistoryRepository BilateralExercisesHistoryRepository { get; }
    }
}
