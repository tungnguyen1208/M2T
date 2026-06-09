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
public sealed class OrdersController(OrderService orderService) : ControllerBase
{
    [HttpGet]
    public async Task<PagedResult<OrderDto>> List(int page = 1, int pageSize = 10, OrderStatus? status = null, string? search = null, DateTime? from = null, DateTime? to = null)
    {
        var query = orderService.BaseQuery();
        if (status.HasValue) query = query.Where(x => x.Status == status.Value);
        if (!string.IsNullOrWhiteSpace(search)) query = query.Where(x => x.Code.Contains(search) || (x.Customer != null && x.Customer.Name.Contains(search)));
        if (from.HasValue) query = query.Where(x => x.OrderedAt >= from.Value.Date);
        if (to.HasValue) query = query.Where(x => x.OrderedAt <= to.Value.Date.AddDays(1).AddTicks(-1));

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(x => x.OrderedAt).Skip((page - 1) * pageSize).Take(pageSize).Select(x => OrderService.ToDto(x)).ToListAsync();
        return new PagedResult<OrderDto>(items, page, pageSize, total, (int)Math.Ceiling(total / (double)pageSize));
    }

    [HttpGet("recent")]
    public async Task<IReadOnlyList<OrderDto>> Recent(int take = 5) =>
        await orderService.BaseQuery().OrderByDescending(x => x.OrderedAt).Take(take).Select(x => OrderService.ToDto(x)).ToListAsync();

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> Get(int id)
    {
        var order = await orderService.GetAsync(id);
        return order is null ? NotFound(new ApiError("Đơn hàng không tồn tại.")) : Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderRequest request)
    {
        var (order, error) = await orderService.CreateAsync(request);
        return error is not null ? BadRequest(new ApiError(error)) : CreatedAtAction(nameof(Get), new { id = order!.Id }, order);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<OrderDto>> UpdateStatus(int id, UpdateOrderStatusRequest request)
    {
        var (order, error) = await orderService.UpdateStatusAsync(id, request.Status);
        return error is not null ? BadRequest(new ApiError(error)) : Ok(order);
    }
}
