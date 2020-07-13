using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyTrainer;
using MyTrainer.Context;
using MyTrainer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyTrainer
{
    public static class ServicesExtentionMethods
    {
        public static void ConfigureSqlDbContext(this IServiceCollection services, IConfiguration config)
        {
            string connectionString = config.GetConnectionString("sqlConnectionString");
            services.AddDbContext<MyTrainerDbContext>(server => server.UseSqlServer(connectionString, optionsBuilder => optionsBuilder.MigrationsAssembly("MyTrainer")));
        }

        public static void ConfigureIdentity(this IServiceCollection services)
        {
            services.AddIdentity<User, IdentityRole>(options => {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
            }).AddEntityFrameworkStores<MyTrainerDbContext>();
        }

        public static void ConfigureRepositoryWrapper(this IServiceCollection services)
        {
            services.AddScoped<IRepositoryWrapper, RepositoryWrapper>();
        }
    }
}