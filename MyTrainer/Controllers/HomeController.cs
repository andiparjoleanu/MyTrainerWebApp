using System;
using System.IO;
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
using Grpc.Core;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json.Linq;

namespace MyTrainer.Controllers
{
    public class HomeController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepositoryWrapper _repositoryWrapper;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public HomeController(UserManager<User> userManager, 
                              IRepositoryWrapper repositoryWrapper,
                              IWebHostEnvironment webHostEnvironment)
        {
            _userManager = userManager;
            _repositoryWrapper = repositoryWrapper;
            _webHostEnvironment = webHostEnvironment;
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

        [HttpGet]
        public IActionResult Pro()
        {
            return PartialView();
        }

        [HttpGet]
        public IActionResult ClassifierCounter()
        {
            return PartialView();
        }

        [HttpGet]
        public IActionResult AddExercise()
        {
            return PartialView();
        }

        [HttpGet]
        public IActionResult TrainingCounter()
        {
            return PartialView();
        }

        [HttpGet]
        public IActionResult TrainingOptions()
        {
            return PartialView();
        }

        [HttpPost]
        public IActionResult WriteInputFile(InputFileVM inputFile)
        {
            string webRootPath = _webHostEnvironment.WebRootPath;
            string path = Path.Combine(webRootPath, "model", "auxiliar.json");
            StreamWriter stream = new StreamWriter(path);
            stream.Write(inputFile.Content);
            stream.Close();
            return Ok();
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
