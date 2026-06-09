using POS365Computer.Api.Entities;

namespace POS365Computer.Api.DTOs;

public sealed record ApiError(string Message, IDictionary<string, string[]>? Errors = null);
public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int TotalItems, int TotalPages);

public sealed record LoginRequest(string UserName, string Password);
public sealed record AuthUserDto(int Id, string FullName, string UserName, string Role);
public sealed record LoginResponse(string Token, DateTime ExpiresAt, AuthUserDto User);

public sealed record CategoryDto(int Id, string Name, string Icon);

public sealed record ProductDto(
    int Id,
    string Name,
    string Sku,
    string Description,
    decimal Price,
    decimal CostPrice,
    int StockQuantity,
    string ImageUrl,
    string Status,
    int CategoryId,
    string CategoryName);

public sealed record UpsertProductRequest(
    string Name,
    string Sku,
    string Description,
    decimal Price,
    decimal CostPrice,
    int StockQuantity,
    string ImageUrl,
    int CategoryId,
    ProductStatus Status);

public sealed record CustomerDto(int Id, string Name, string Phone, string Email, string Address, DateTime CreatedAt, int OrderCount);
public sealed record UpsertCustomerRequest(string Name, string Phone, string Email, string Address);

public sealed record OrderItemDto(int ProductId, string ProductName, int Quantity, decimal UnitPrice, decimal LineTotal);
public sealed record OrderDto(int Id, string Code, int CustomerId, string CustomerName, decimal TotalAmount, string Status, DateTime OrderedAt, IReadOnlyList<OrderItemDto> Items);
public sealed record CreateOrderItemRequest(int ProductId, int Quantity);
public sealed record CreateOrderRequest(int CustomerId, OrderStatus Status, IReadOnlyList<CreateOrderItemRequest> Items);
public sealed record UpdateOrderStatusRequest(OrderStatus Status);

public sealed record DashboardSummaryDto(decimal RevenueToday, int OrdersToday, int TopProductsSold, int NewCustomers, decimal ProfitToday);
public sealed record RevenuePointDto(string Label, decimal Revenue);
public sealed record InventoryStatusDto(string CategoryName, int ProductCount, int StockQuantity, int Percentage);
public sealed record TopProductDto(int Rank, int ProductId, string Name, string ImageUrl, int SoldQuantity, decimal Revenue);

public sealed record InventoryTransactionDto(int Id, int ProductId, string ProductName, string Type, int Quantity, string Note, DateTime CreatedAt);
public sealed record StockInRequest(int ProductId, int Quantity, string Note);
public sealed record AdjustStockRequest(int ProductId, int QuantityDelta, string Note);
