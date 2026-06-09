using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS365Computer.Api.Data;
using POS365Computer.Api.DTOs;
using POS365Computer.Api.Entities;

namespace POS365Computer.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class CustomersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<PagedResult<CustomerDto>> List(int page = 1, int pageSize = 10, string? search = null)
    {
        var query = db.Customers.Include(x => x.Orders).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x => x.Name.Contains(search) || x.Phone.Contains(search) || x.Email.Contains(search));
        }

        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var total = await query.CountAsync();
        var items = await query.OrderByDescending(x => x.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).Select(x => ToDto(x)).ToListAsync();
        return new PagedResult<CustomerDto>(items, page, pageSize, total, (int)Math.Ceiling(total / (double)pageSize));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CustomerDto>> Get(int id)
    {
        var customer = await db.Customers.Include(x => x.Orders).FirstOrDefaultAsync(x => x.Id == id);
        return customer is null ? NotFound(new ApiError("Khách hàng không tồn tại.")) : Ok(ToDto(customer));
    }

    [HttpPost]
    public async Task<ActionResult<CustomerDto>> Create(UpsertCustomerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new ApiError("Tên khách hàng là bắt buộc."));
        }

        var customer = new Customer
        {
            Name = request.Name.Trim(),
            Phone = request.Phone.Trim(),
            Email = request.Email.Trim(),
            Address = request.Address.Trim(),
            CreatedAt = DateTime.UtcNow
        };
        db.Customers.Add(customer);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = customer.Id }, ToDto(customer));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CustomerDto>> Update(int id, UpsertCustomerRequest request)
    {
        var customer = await db.Customers.Include(x => x.Orders).FirstOrDefaultAsync(x => x.Id == id);
        if (customer is null)
        {
            return NotFound(new ApiError("Khách hàng không tồn tại."));
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new ApiError("Tên khách hàng là bắt buộc."));
        }

        customer.Name = request.Name.Trim();
        customer.Phone = request.Phone.Trim();
        customer.Email = request.Email.Trim();
        customer.Address = request.Address.Trim();
        await db.SaveChangesAsync();
        return Ok(ToDto(customer));
    }

    private static CustomerDto ToDto(Customer customer) => new(
        customer.Id,
        customer.Name,
        customer.Phone,
        customer.Email,
        customer.Address,
        customer.CreatedAt,
        customer.Orders.Count);
}
