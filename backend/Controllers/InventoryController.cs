using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS365Computer.Api.DTOs;
using POS365Computer.Api.Entities;
using POS365Computer.Api.Services;

namespace POS365Computer.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class InventoryController(InventoryService inventoryService, DashboardService dashboardService) : ControllerBase
{
    [HttpGet("status")]
    public async Task<IReadOnlyList<InventoryStatusDto>> Status() => await dashboardService.GetInventoryStatusAsync();

    [HttpGet("transactions")]
    public async Task<PagedResult<InventoryTransactionDto>> Transactions(int page = 1, int pageSize = 10, int? productId = null, InventoryTransactionType? type = null)
    {
        var query = inventoryService.BaseQuery();
        if (productId.HasValue) query = query.Where(x => x.ProductId == productId);
        if (type.HasValue) query = query.Where(x => x.Type == type.Value);

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(x => x.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).Select(x => InventoryService.ToDto(x)).ToListAsync();
        return new PagedResult<InventoryTransactionDto>(items, page, pageSize, total, (int)Math.Ceiling(total / (double)pageSize));
    }

    [HttpPost("stock-in")]
    public async Task<ActionResult<InventoryTransactionDto>> StockIn(StockInRequest request)
    {
        var (transaction, error) = await inventoryService.StockInAsync(request);
        return error is not null ? BadRequest(new ApiError(error)) : Ok(transaction);
    }

    [HttpPost("adjust")]
    public async Task<ActionResult<InventoryTransactionDto>> Adjust(AdjustStockRequest request)
    {
        var (transaction, error) = await inventoryService.AdjustAsync(request);
        return error is not null ? BadRequest(new ApiError(error)) : Ok(transaction);
    }
}
