using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MyTrainer;
using MyTrainer.Models;
using MyTrainer.ViewModels;

namespace MyTrainer.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepositoryWrapper _repositoryWrapper;

        public HomeController(UserManager<User> userManager, 
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
                return View();
            }
        }

        [HttpGet]
        public async Task<IActionResult> ChooseExercise()
        {
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

            return PartialView(exerciseVMs);
        }

        [HttpGet]
        public IActionResult CounterUnilateralExercises()
        {
            return PartialView();
        }

        [HttpGet]
        public IActionResult CounterBilateralExercises()
        {
            return PartialView();
        }

        [HttpPost]
        public async Task<IActionResult> SaveRepsUnilateral(UnilateralRepsVM convertedData)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            
            if(user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            var userVM = new UserVM
            {
                UserId = user.Id,
                UserName = user.UserName
            };

            
            History history = new History
            {
                ExerciseId = convertedData.ExerciseId,
                Date = DateTime.Now,
                UserId = userVM.UserId
            };

            await _repositoryWrapper.HistoryRepository.CreateAsync(history);

            UnilateralExercisesHistory unilateralHistory = new UnilateralExercisesHistory
            {
                ExerciseId = convertedData.ExerciseId,
                UserId = userVM.UserId,
                Date = history.Date,
                Reps = convertedData.Reps
            };

            await _repositoryWrapper.UnilateralExercisesHistoryRepository.CreateAsync(unilateralHistory);

            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> SaveRepsBilateral(BilateralRepsVM convertedData)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if(user == null)
            {
                return RedirectToAction("Login", "Account");
            }

            var userVM = new UserVM
            {
                UserId = user.Id,
                UserName = user.UserName
            };


            History history = new History
            {
                ExerciseId = convertedData.ExerciseId,
                Date = DateTime.Now,
                UserId = userVM.UserId
            };

            await _repositoryWrapper.HistoryRepository.CreateAsync(history);


            BilateralExercisesHistory bilateralHistory = new BilateralExercisesHistory
            {
                ExerciseId = convertedData.ExerciseId,
                UserId = userVM.UserId,
                Date = history.Date,
                LeftSideReps = convertedData.LeftSideReps,
                RightSideReps = convertedData.RightSideReps
            };

            await _repositoryWrapper.BilateralExercisesHistoryRepository.CreateAsync(bilateralHistory);


            return Ok();
        }
    }
}
