using Microsoft.EntityFrameworkCore;
using POS365Computer.Api.Data;
using POS365Computer.Api.DTOs;
using POS365Computer.Api.Entities;

namespace POS365Computer.Api.Services;

public sealed class InventoryService(AppDbContext db)
{
    public async Task<(InventoryTransactionDto? Transaction, string? Error)> StockInAsync(StockInRequest request)
    {
        if (request.Quantity <= 0)
        {
            return (null, "Số lượng nhập phải lớn hơn 0.");
        }

        var product = await db.Products.FindAsync(request.ProductId);
        if (product is null)
        {
            return (null, "Sản phẩm không tồn tại.");
        }

        product.StockQuantity += request.Quantity;
        var transaction = new InventoryTransaction
        {
            ProductId = product.Id,
            Type = InventoryTransactionType.StockIn,
            Quantity = request.Quantity,
            Note = request.Note,
            CreatedAt = DateTime.UtcNow
        };
        db.InventoryTransactions.Add(transaction);
        await db.SaveChangesAsync();
        transaction.Product = product;
        return (ToDto(transaction), null);
    }

    public async Task<(InventoryTransactionDto? Transaction, string? Error)> AdjustAsync(AdjustStockRequest request)
    {
        var product = await db.Products.FindAsync(request.ProductId);
        if (product is null)
        {
            return (null, "Sản phẩm không tồn tại.");
        }

        if (product.StockQuantity + request.QuantityDelta < 0)
        {
            return (null, "Tồn kho không thể nhỏ hơn 0.");
        }

        product.StockQuantity += request.QuantityDelta;
        var transaction = new InventoryTransaction
        {
            ProductId = product.Id,
            Type = InventoryTransactionType.Adjustment,
            Quantity = request.QuantityDelta,
            Note = request.Note,
            CreatedAt = DateTime.UtcNow
        };
        db.InventoryTransactions.Add(transaction);
        await db.SaveChangesAsync();
        transaction.Product = product;
        return (ToDto(transaction), null);
    }

    public static InventoryTransactionDto ToDto(InventoryTransaction transaction) => new(
        transaction.Id,
        transaction.ProductId,
        transaction.Product?.Name ?? string.Empty,
        transaction.Type.ToString(),
        transaction.Quantity,
        transaction.Note,
        transaction.CreatedAt);

    public IQueryable<InventoryTransaction> BaseQuery() => db.InventoryTransactions.Include(x => x.Product);
}
