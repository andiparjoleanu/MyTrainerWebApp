using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyTrainer.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace MyTrainer.Context
{
    public class MyTrainerDbContext : IdentityDbContext<User>
    { 
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<BilateralExercisesHistory> BilateralExercisesHistories { get; set; }
        public DbSet<UnilateralExercisesHistory> UnilateralExercisesHistories { get; set; }


        public MyTrainerDbContext(DbContextOptions options) : base(options) { }

        public MyTrainerDbContext() { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(user => user.Id);
            });

            modelBuilder.Entity<Exercise>(entity =>
            {
                entity.HasKey(exercise => exercise.Id);
            });

            modelBuilder.Entity<Exercise>().HasData(
                new Exercise
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Extensii pentru biceps",
                    Type = "Bilateral",
                    Script = "js/bicepCurl.js"
                },
                new Exercise
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Ridicări laterale cu greutăți",
                    Type = "Bilateral",
                    Script = "js/lateralRaise.js"
                },
                new Exercise
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "Genuflexiuni",
                    Type = "Unilateral",
                    Script = "js/squats.js"
                }
            );

            modelBuilder.Entity<History>(entity =>
            {
                entity.HasKey(history => new { history.UserId, history.ExerciseId, history.Date });

                entity.HasOne(history => history.User)
                      .WithMany(user => user.Histories)
                      .HasForeignKey(history => history.UserId);

                entity.HasOne(history => history.Exercise)
                      .WithMany(user => user.Histories)
                      .HasForeignKey(history => history.ExerciseId);
            });

            modelBuilder.Entity<UnilateralExercisesHistory>(entity =>
            {
                entity.HasKey(history => new { history.UserId, history.ExerciseId, history.Date });

                entity.HasOne(x => x.History)
                      .WithOne(x => x.UnilateralExercisesHistory)
                      .HasForeignKey("UnilateralExercisesHistory", "UserId", "ExerciseId", "Date")
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<BilateralExercisesHistory>(entity =>
            {
                entity.HasKey(history => new { history.UserId, history.ExerciseId, history.Date });

                entity.HasOne(x => x.History)
                      .WithOne(x => x.BilateralExercisesHistory)
                      .HasForeignKey("BilateralExercisesHistory", "UserId", "ExerciseId", "Date")
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
