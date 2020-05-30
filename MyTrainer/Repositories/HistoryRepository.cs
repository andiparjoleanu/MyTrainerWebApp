using MyTrainer.Context;
using MyTrainer.IRepositories;
using MyTrainer.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTrainer.Repositories
{
    public class HistoryRepository : BaseRepository<History>, IHistoryRepository   
    {
        public HistoryRepository(MyTrainerDbContext context) : base(context) { }
    }
}
