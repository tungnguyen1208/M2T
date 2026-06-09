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
public sealed class ProductsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<PagedResult<ProductDto>> List(int page = 1, int pageSize = 12, string? search = null, int? categoryId = null, string? sort = null)
    {
        var query = db.Products.Include(x => x.Category).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(x => x.Name.Contains(search) || x.Sku.Contains(search));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == categoryId.Value);
        }

        query = sort switch
        {
            "price-desc" => query.OrderByDescending(x => x.Price),
            "price-asc" => query.OrderBy(x => x.Price),
            "stock-asc" => query.OrderBy(x => x.StockQuantity),
            _ => query.OrderBy(x => x.Id)
        };

        return await PageAsync(query, page, pageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> Get(int id)
    {
        var product = await db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);
        return product is null ? NotFound(new ApiError("Sản phẩm không tồn tại.")) : Ok(ToDto(product));
    }

    [HttpGet("top-selling")]
    public async Task<IReadOnlyList<TopProductDto>> TopSelling(DateTime? from, DateTime? to, int take = 5)
    {
        var start = (from ?? new DateTime(2024, 5, 23)).Date;
        var end = (to ?? new DateTime(2024, 5, 23)).Date.AddDays(1).AddTicks(-1);

        var items = await db.OrderItems
            .Include(x => x.Order)
            .Include(x => x.Product)
            .Where(x => x.Order != null && x.Order.OrderedAt >= start && x.Order.OrderedAt <= end && x.Order.Status != OrderStatus.Cancelled)
            .GroupBy(x => new { x.ProductId, x.Product!.Name, x.Product.ImageUrl })
            .Select(x => new { x.Key.ProductId, x.Key.Name, x.Key.ImageUrl, SoldQuantity = x.Sum(i => i.Quantity), Revenue = x.Sum(i => i.LineTotal) })
            .OrderByDescending(x => x.SoldQuantity)
            .Take(take)
            .ToListAsync();

        return items.Select((x, index) => new TopProductDto(index + 1, x.ProductId, x.Name, x.ImageUrl, x.SoldQuantity, x.Revenue)).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(UpsertProductRequest request)
    {
        var validation = await ValidateAsync(request);
        if (validation is not null)
        {
            return BadRequest(new ApiError(validation));
        }

        var product = new Product();
        Apply(product, request);
        db.Products.Add(product);
        await db.SaveChangesAsync();
        await db.Entry(product).Reference(x => x.Category).LoadAsync();
        return CreatedAtAction(nameof(Get), new { id = product.Id }, ToDto(product));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> Update(int id, UpsertProductRequest request)
    {
        var product = await db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);
        if (product is null)
        {
            return NotFound(new ApiError("Sản phẩm không tồn tại."));
        }

        var validation = await ValidateAsync(request, id);
        if (validation is not null)
        {
            return BadRequest(new ApiError(validation));
        }

        Apply(product, request);
        await db.SaveChangesAsync();
        await db.Entry(product).Reference(x => x.Category).LoadAsync();
        return Ok(ToDto(product));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null)
        {
            return NotFound(new ApiError("Sản phẩm không tồn tại."));
        }

        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<string?> ValidateAsync(UpsertProductRequest request, int? currentId = null)
    {
        if (string.IsNullOrWhiteSpace(request.Name)) return "Tên sản phẩm là bắt buộc.";
        if (string.IsNullOrWhiteSpace(request.Sku)) return "SKU là bắt buộc.";
        if (request.Price <= 0) return "Giá bán phải lớn hơn 0.";
        if (request.CostPrice < 0) return "Giá vốn không hợp lệ.";
        if (request.StockQuantity < 0) return "Tồn kho không thể nhỏ hơn 0.";
        if (!await db.Categories.AnyAsync(x => x.Id == request.CategoryId)) return "Danh mục không tồn tại.";
        if (await db.Products.AnyAsync(x => x.Sku == request.Sku && x.Id != currentId)) return "SKU đã tồn tại.";
        return null;
    }

    private static void Apply(Product product, UpsertProductRequest request)
    {
        product.Name = request.Name.Trim();
        product.Sku = request.Sku.Trim();
        product.Description = request.Description.Trim();
        product.Price = request.Price;
        product.CostPrice = request.CostPrice;
        product.StockQuantity = request.StockQuantity;
        product.ImageUrl = request.ImageUrl.Trim();
        product.CategoryId = request.CategoryId;
        product.Status = request.Status;
    }

    private static ProductDto ToDto(Product product) => new(
        product.Id,
        product.Name,
        product.Sku,
        product.Description,
        product.Price,
        product.CostPrice,
        product.StockQuantity,
        product.ImageUrl,
        product.Status.ToString(),
        product.CategoryId,
        product.Category?.Name ?? string.Empty);

    private static async Task<PagedResult<ProductDto>> PageAsync(IQueryable<Product> query, int page, int pageSize)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);
        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(x => ToDto(x)).ToListAsync();
        return new PagedResult<ProductDto>(items, page, pageSize, total, (int)Math.Ceiling(total / (double)pageSize));
    }
}
