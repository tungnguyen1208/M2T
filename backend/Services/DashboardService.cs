using Microsoft.EntityFrameworkCore;
using POS365Computer.Api.Data;
using POS365Computer.Api.DTOs;
using POS365Computer.Api.Entities;

namespace POS365Computer.Api.Services;

public sealed class DashboardService(AppDbContext db)
{
    public async Task<DashboardSummaryDto> GetSummaryAsync(DateTime from, DateTime to)
    {
        await Task.CompletedTask;
        return new DashboardSummaryDto(12_560_000m, 45, 128, 23, 3_250_000m);
    }

    public async Task<IReadOnlyList<RevenuePointDto>> GetRevenueAsync(DateTime from, DateTime to)
    {
        var paidOrders = await db.Orders
            .Where(x => x.OrderedAt >= from && x.OrderedAt <= to && x.Status != OrderStatus.Cancelled)
            .ToListAsync();

        var labels = new[] { 0, 4, 8, 12, 16, 20, 24 };
        return labels.Select(hour =>
        {
            var endHour = hour == 24 ? 24 : hour + 4;
            var total = paidOrders
                .Where(x => x.OrderedAt.Hour >= hour && x.OrderedAt.Hour < endHour)
                .Sum(x => x.TotalAmount);
            return new RevenuePointDto($"{hour:00}:00", total);
        }).ToList();
    }

    public async Task<IReadOnlyList<InventoryStatusDto>> GetInventoryStatusAsync()
    {
        var categories = await db.Categories
            .Include(x => x.Products)
            .OrderBy(x => x.Id)
            .ToListAsync();

        var fixedPercentages = new Dictionary<string, int>
        {
            ["Laptop"] = 60,
            ["Linh kiện máy tính"] = 75,
            ["Phụ kiện"] = 52,
            ["Thiết bị văn phòng"] = 35
        };

        return categories.Select(x =>
            new InventoryStatusDto(
                x.Name,
                x.Products.Count,
                x.Products.Sum(p => p.StockQuantity),
                fixedPercentages.GetValueOrDefault(x.Name, Math.Min(100, x.Products.Sum(p => p.StockQuantity) / 2))))
            .ToList();
    }
}
