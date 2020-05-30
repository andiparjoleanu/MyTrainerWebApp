using MyTrainer.Context;
using MyTrainer.IRepositories;
using MyTrainer.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTrainer
{
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private MyTrainerDbContext _context;
        private IExerciseRepository _exercise;
        private IHistoryRepository _history;
        private IBilateralExercisesHistoryRepository _bilateralExercisesHistory;
        private IUnilateralExercisesHistoryRepository _unilateralExercisesHistory;

        public IExerciseRepository ExerciseRepository
        {
            get
            {
                if(_exercise == null)
                {
                    _exercise = new ExerciseRepository(_context);
                }

                return _exercise;
            }
        }

        public IHistoryRepository HistoryRepository
        { 
            get
            {
                if(_history == null)
                {
                    _history = new HistoryRepository(_context);
                }

                return _history;
            }
        }

        public IUnilateralExercisesHistoryRepository UnilateralExercisesHistoryRepository
        {
            get
            {
                if (_unilateralExercisesHistory == null)
                {
                    _unilateralExercisesHistory = new UnilateralExercisesHistoryRepository(_context);
                }

                return _unilateralExercisesHistory;
            }
        }

        public IBilateralExercisesHistoryRepository BilateralExercisesHistoryRepository
        {
            get
            {
                if (_bilateralExercisesHistory == null)
                {
                    _bilateralExercisesHistory = new BilateralExercisesHistoryRepository(_context);
                }

                return _bilateralExercisesHistory;
            }
        }

        public RepositoryWrapper(MyTrainerDbContext context)
        {
            _context = context;
        }
    }
}
