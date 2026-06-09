using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using POS365Computer.Api.DTOs;
using POS365Computer.Api.Services;

namespace POS365Computer.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class DashboardController(DashboardService dashboardService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<DashboardSummaryDto> Summary(DateTime? from, DateTime? to) =>
        await dashboardService.GetSummaryAsync(NormalizeFrom(from), NormalizeTo(to));

    [HttpGet("revenue")]
    public async Task<IReadOnlyList<RevenuePointDto>> Revenue(DateTime? from, DateTime? to, string groupBy = "hour") =>
        await dashboardService.GetRevenueAsync(NormalizeFrom(from), NormalizeTo(to));

    private static DateTime NormalizeFrom(DateTime? value) => (value ?? new DateTime(2024, 5, 23)).Date;
    private static DateTime NormalizeTo(DateTime? value) => (value ?? new DateTime(2024, 5, 23)).Date.AddDays(1).AddTicks(-1);
}
