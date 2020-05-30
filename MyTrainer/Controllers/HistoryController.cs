using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyTrainer;
using MyTrainer.Models;
using MyTrainer.ViewModels;

namespace MyTrainer.Controllers
{
    
    public class HistoryController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepositoryWrapper _repositoryWrapper;

        public HistoryController(UserManager<User> userManager, 
                                 IRepositoryWrapper repositoryWrapper)
        {
            _userManager = userManager;
            _repositoryWrapper = repositoryWrapper;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                ViewBag.Username = "Guest";
                return RedirectToAction("Login", "Account");
            }
            else
            {
                ViewBag.Username = user.UserName;

                List<Exercise> exercises = await _repositoryWrapper.ExerciseRepository.GetAllAsync();

                List<ExerciseVM> exerciseVMs = new List<ExerciseVM>();

                foreach (var exercise in exercises)
                {
                    exerciseVMs.Add(new ExerciseVM
                    {
                        Id = exercise.Id,
                        Type = exercise.Type,
                        Name = exercise.Name,
                        Script = exercise.Script
                    });
                }

                return View(exerciseVMs);
            }
        }

        [HttpGet]
        public async Task<IActionResult> SearchUserUnilateralHistory(string exerciseId) 
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                List<UnilateralExercisesHistoryVM> histories = new List<UnilateralExercisesHistoryVM>();
                var unilateralHistories = await _repositoryWrapper.UnilateralExercisesHistoryRepository.GetAllAsync();

                foreach (var unilateralHistory in unilateralHistories)
                {
                    if (unilateralHistory.ExerciseId == exerciseId && unilateralHistory.UserId == user.Id)
                    {
                        histories.Add(new UnilateralExercisesHistoryVM
                        {
                            UserId = unilateralHistory.UserId,
                            ExerciseId = unilateralHistory.ExerciseId,
                            Date = unilateralHistory.Date,
                            Reps = unilateralHistory.Reps
                        });
                    }
                }
               
                return PartialView(histories);
            }

            return RedirectToAction("Login", "Account");
        }

        [HttpGet]
        public async Task<IActionResult> SearchUserBilateralHistory(string exerciseId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user != null)
            {
                List<BilateralExercisesHistoryVM> histories = new List<BilateralExercisesHistoryVM>();
                var bilateralHistories = await _repositoryWrapper.BilateralExercisesHistoryRepository.GetAllAsync();

                foreach (var bilateralHistory in bilateralHistories)
                {
                    if (bilateralHistory.ExerciseId == exerciseId && bilateralHistory.UserId == user.Id)
                    {
                        histories.Add(new BilateralExercisesHistoryVM
                        {
                            UserId = bilateralHistory.UserId,
                            ExerciseId = bilateralHistory.ExerciseId,
                            Date = bilateralHistory.Date,
                            LeftSideReps = bilateralHistory.LeftSideReps,
                            RightSideReps = bilateralHistory.RightSideReps
                        });
                    }
                }

                return PartialView(histories);

            }

            return RedirectToAction("Login", "Account");
        }
    }
}