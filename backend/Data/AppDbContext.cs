using Microsoft.EntityFrameworkCore;
using POS365Computer.Api.Entities;
using POS365Computer.Api.Utilities;

namespace POS365Computer.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(x => x.UserName).IsUnique();
            entity.Property(x => x.FullName).HasMaxLength(120).IsRequired();
            entity.Property(x => x.UserName).HasMaxLength(80).IsRequired();
            entity.Property(x => x.PasswordHash).HasMaxLength(128).IsRequired();
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(100).IsRequired();
            entity.Property(x => x.Icon).HasMaxLength(40);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(180).IsRequired();
            entity.Property(x => x.Sku).HasMaxLength(60).IsRequired();
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.Property(x => x.ImageUrl).HasMaxLength(600);
            entity.Property(x => x.Price).HasColumnType("decimal(18,2)");
            entity.Property(x => x.CostPrice).HasColumnType("decimal(18,2)");
            entity.HasIndex(x => x.Sku).IsUnique();
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(120).IsRequired();
            entity.Property(x => x.Phone).HasMaxLength(30);
            entity.Property(x => x.Email).HasMaxLength(120);
            entity.Property(x => x.Address).HasMaxLength(300);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(x => x.Code).HasMaxLength(30).IsRequired();
            entity.Property(x => x.TotalAmount).HasColumnType("decimal(18,2)");
            entity.HasIndex(x => x.Code).IsUnique();
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.Property(x => x.UnitPrice).HasColumnType("decimal(18,2)");
            entity.Property(x => x.LineTotal).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<InventoryTransaction>(entity =>
        {
            entity.Property(x => x.Note).HasMaxLength(250);
        });

        Seed(modelBuilder);
    }

    private static void Seed(ModelBuilder modelBuilder)
    {
        var day = new DateTime(2024, 5, 23, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            FullName = "Admin",
            UserName = "admin",
            PasswordHash = PasswordHash.Create("Admin@123"),
            Role = UserRole.Admin,
            CreatedAt = day
        });

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Laptop", Icon = "laptop" },
            new Category { Id = 2, Name = "Linh kiện máy tính", Icon = "cpu" },
            new Category { Id = 3, Name = "Phụ kiện", Icon = "mouse" },
            new Category { Id = 4, Name = "Thiết bị văn phòng", Icon = "printer" },
            new Category { Id = 5, Name = "Thiết bị mạng", Icon = "router" },
            new Category { Id = 6, Name = "PC", Icon = "hdd" });

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, CategoryId = 1, Name = "Laptop Dell Inspiron 15 3520", Sku = "LAP-DELL-3520", Description = "Laptop văn phòng hiệu năng ổn định", Price = 22500000m, CostPrice = 18000000m, StockQuantity = 36, ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=760&q=80", Status = ProductStatus.Active },
            new Product { Id = 2, CategoryId = 1, Name = "Laptop ASUS VivoBook 15 X1504VA", Sku = "LAP-ASUS-X1504VA", Description = "Mỏng nhẹ cho học tập và làm việc", Price = 15490000m, CostPrice = 12200000m, StockQuantity = 42, ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=760&q=80", Status = ProductStatus.Active },
            new Product { Id = 3, CategoryId = 3, Name = "Chuột không dây Logitech M331", Sku = "ACC-LOGI-M331", Description = "Chuột yên tĩnh cho văn phòng", Price = 350000m, CostPrice = 220000m, StockQuantity = 95, ImageUrl = "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=760&q=80", Status = ProductStatus.Active },
            new Product { Id = 4, CategoryId = 3, Name = "Bàn phím cơ DareU EK87", Sku = "ACC-DAREU-EK87", Description = "Bàn phím cơ layout gọn", Price = 950000m, CostPrice = 690000m, StockQuantity = 64, ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=760&q=80", Status = ProductStatus.Active },
            new Product { Id = 5, CategoryId = 4, Name = "Màn hình LG 24MP400-B 24 inch", Sku = "MON-LG-24MP400", Description = "Màn hình IPS 24 inch cho văn phòng", Price = 2390000m, CostPrice = 1800000m, StockQuantity = 53, ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=760&q=80", Status = ProductStatus.Active },
            new Product { Id = 6, CategoryId = 6, Name = "PC Gaming M2T RTX 4060", Sku = "PC-M2T-4060", Description = "Bộ máy chơi game, thiết kế đồ họa", Price = 25880000m, CostPrice = 21700000m, StockQuantity = 30, ImageUrl = "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=760&q=80", Status = ProductStatus.Active });

        modelBuilder.Entity<Customer>().HasData(
            new Customer { Id = 1, Name = "Nguyễn Văn A", Phone = "0901000001", Email = "a@example.com", Address = "Hà Nội", CreatedAt = day.AddHours(8) },
            new Customer { Id = 2, Name = "Trần Thị B", Phone = "0901000002", Email = "b@example.com", Address = "Hà Nội", CreatedAt = day.AddHours(9) },
            new Customer { Id = 3, Name = "Lê Văn C", Phone = "0901000003", Email = "c@example.com", Address = "Hà Nội", CreatedAt = day.AddHours(10) },
            new Customer { Id = 4, Name = "Phạm Thị D", Phone = "0901000004", Email = "d@example.com", Address = "Hà Nội", CreatedAt = day.AddHours(11) },
            new Customer { Id = 5, Name = "Hoàng Văn E", Phone = "0901000005", Email = "e@example.com", Address = "Hà Nội", CreatedAt = day.AddHours(12) });

        modelBuilder.Entity<Order>().HasData(
            new Order { Id = 1, Code = "DH10045", CustomerId = 1, TotalAmount = 15490000m, Status = OrderStatus.Paid, OrderedAt = day.AddHours(14).AddMinutes(30) },
            new Order { Id = 2, Code = "DH10044", CustomerId = 2, TotalAmount = 2390000m, Status = OrderStatus.Processing, OrderedAt = day.AddHours(14).AddMinutes(15) },
            new Order { Id = 3, Code = "DH10043", CustomerId = 3, TotalAmount = 950000m, Status = OrderStatus.PendingPayment, OrderedAt = day.AddHours(13).AddMinutes(50) },
            new Order { Id = 4, Code = "DH10042", CustomerId = 4, TotalAmount = 350000m, Status = OrderStatus.Cancelled, OrderedAt = day.AddHours(13).AddMinutes(20) },
            new Order { Id = 5, Code = "DH10041", CustomerId = 5, TotalAmount = 25880000m, Status = OrderStatus.Paid, OrderedAt = day.AddHours(12).AddMinutes(45) });

        modelBuilder.Entity<OrderItem>().HasData(
            new OrderItem { Id = 1, OrderId = 1, ProductId = 2, Quantity = 1, UnitPrice = 15490000m, LineTotal = 15490000m },
            new OrderItem { Id = 2, OrderId = 2, ProductId = 5, Quantity = 1, UnitPrice = 2390000m, LineTotal = 2390000m },
            new OrderItem { Id = 3, OrderId = 3, ProductId = 4, Quantity = 1, UnitPrice = 950000m, LineTotal = 950000m },
            new OrderItem { Id = 4, OrderId = 4, ProductId = 3, Quantity = 1, UnitPrice = 350000m, LineTotal = 350000m },
            new OrderItem { Id = 5, OrderId = 5, ProductId = 6, Quantity = 1, UnitPrice = 25880000m, LineTotal = 25880000m },
            new OrderItem { Id = 6, OrderId = 1, ProductId = 1, Quantity = 15, UnitPrice = 15000000m, LineTotal = 225000000m });

        modelBuilder.Entity<InventoryTransaction>().HasData(
            new InventoryTransaction { Id = 1, ProductId = 1, Type = InventoryTransactionType.StockIn, Quantity = 120, Note = "Seed laptop stock", CreatedAt = day },
            new InventoryTransaction { Id = 2, ProductId = 6, Type = InventoryTransactionType.StockIn, Quantity = 320, Note = "Seed PC stock", CreatedAt = day },
            new InventoryTransaction { Id = 3, ProductId = 3, Type = InventoryTransactionType.StockIn, Quantity = 260, Note = "Seed accessory stock", CreatedAt = day },
            new InventoryTransaction { Id = 4, ProductId = 5, Type = InventoryTransactionType.StockIn, Quantity = 150, Note = "Seed office device stock", CreatedAt = day });
    }
}
