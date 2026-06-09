using Microsoft.EntityFrameworkCore;
using POS365Computer.Api.Data;
using POS365Computer.Api.DTOs;
using POS365Computer.Api.Entities;

namespace POS365Computer.Api.Services;

public sealed class OrderService(AppDbContext db)
{
    public async Task<(OrderDto? Order, string? Error)> CreateAsync(CreateOrderRequest request)
    {
        if (request.Items.Count == 0)
        {
            return (null, "Đơn hàng phải có ít nhất một sản phẩm.");
        }

        var customerExists = await db.Customers.AnyAsync(x => x.Id == request.CustomerId);
        if (!customerExists)
        {
            return (null, "Khách hàng không tồn tại.");
        }

        var productIds = request.Items.Select(x => x.ProductId).Distinct().ToList();
        var products = await db.Products.Where(x => productIds.Contains(x.Id)).ToDictionaryAsync(x => x.Id);

        foreach (var item in request.Items)
        {
            if (!products.TryGetValue(item.ProductId, out var product))
            {
                return (null, $"Sản phẩm {item.ProductId} không tồn tại.");
            }

            if (item.Quantity <= 0)
            {
                return (null, "Số lượng sản phẩm phải lớn hơn 0.");
            }

            if (request.Status == OrderStatus.Paid && product.StockQuantity == 0)
            {
                return (null, "Sản phẩm hết hàng !");
            }

            if (request.Status == OrderStatus.Paid && product.StockQuantity < item.Quantity)
            {
                return (null, $"Sản phẩm {product.Name} không đủ tồn kho.");
            }
        }

        var nextId = (await db.Orders.CountAsync()) + 10046;
        var order = new Order
        {
            Code = $"DH{nextId}",
            CustomerId = request.CustomerId,
            Status = request.Status,
            OrderedAt = DateTime.UtcNow
        };

        foreach (var item in request.Items)
        {
            var product = products[item.ProductId];
            var lineTotal = product.Price * item.Quantity;
            order.TotalAmount += lineTotal;
            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                LineTotal = lineTotal
            });

            if (request.Status == OrderStatus.Paid)
            {
                product.StockQuantity -= item.Quantity;
                db.InventoryTransactions.Add(new InventoryTransaction
                {
                    ProductId = product.Id,
                    Type = InventoryTransactionType.StockOut,
                    Quantity = item.Quantity,
                    Note = $"Bán hàng {order.Code}",
                    CreatedAt = order.OrderedAt
                });
            }
        }

        db.Orders.Add(order);
        await db.SaveChangesAsync();

        return (await GetAsync(order.Id), null);
    }

    public async Task<(OrderDto? Order, string? Error)> UpdateStatusAsync(int id, OrderStatus status)
    {
        var order = await db.Orders.Include(x => x.Items).ThenInclude(x => x.Product).FirstOrDefaultAsync(x => x.Id == id);
        if (order is null)
        {
            return (null, "Đơn hàng không tồn tại.");
        }

        if (order.Status != OrderStatus.Paid && status == OrderStatus.Paid)
        {
            foreach (var item in order.Items)
            {
                if (item.Product is null || item.Product.StockQuantity < item.Quantity)
                {
                    return (null, $"Sản phẩm {item.Product?.Name ?? item.ProductId.ToString()} không đủ tồn kho.");
                }
            }

            foreach (var item in order.Items)
            {
                item.Product!.StockQuantity -= item.Quantity;
                db.InventoryTransactions.Add(new InventoryTransaction
                {
                    ProductId = item.ProductId,
                    Type = InventoryTransactionType.StockOut,
                    Quantity = item.Quantity,
                    Note = $"Thanh toán {order.Code}",
                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        order.Status = status;
        await db.SaveChangesAsync();
        return (await GetAsync(id), null);
    }

    public async Task<OrderDto?> GetAsync(int id)
    {
        var order = await BaseQuery().FirstOrDefaultAsync(x => x.Id == id);
        return order is null ? null : ToDto(order);
    }

    public static OrderDto ToDto(Order order) => new(
        order.Id,
        order.Code,
        order.CustomerId,
        order.Customer?.Name ?? string.Empty,
        order.TotalAmount,
        order.Status.ToString(),
        order.OrderedAt,
        order.Items.Select(x => new OrderItemDto(x.ProductId, x.Product?.Name ?? string.Empty, x.Quantity, x.UnitPrice, x.LineTotal)).ToList());

    public IQueryable<Order> BaseQuery() => db.Orders
        .Include(x => x.Customer)
        .Include(x => x.Items)
        .ThenInclude(x => x.Product);
}
