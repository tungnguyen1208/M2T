using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS365Computer.Api.Data;
using POS365Computer.Api.DTOs;

namespace POS365Computer.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class CategoriesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IReadOnlyList<CategoryDto>> List() =>
        await db.Categories
            .OrderBy(x => x.Id)
            .Select(x => new CategoryDto(x.Id, x.Name, x.Icon))
            .ToListAsync();
}
