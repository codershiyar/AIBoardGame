var builder = WebApplication.CreateBuilder(args);

// Add CORS policy to allow any origin, method, and header (suitable for development only)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllPolicy", policyBuilder =>
    {
        policyBuilder
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin(); // Allows requests from any origin
    });
});

// Add services to the container
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios
    app.UseHsts();
}

// Middleware order is important
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Apply CORS middleware
app.UseCors("AllowAllPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
