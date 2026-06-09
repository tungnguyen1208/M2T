using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace POS365Computer.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: false),
                    Sku = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CostPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(600)", maxLength: 600, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CustomerId = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    OrderedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InventoryTransactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventoryTransactions_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LineTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Icon", "Name" },
                values: new object[,]
                {
                    { 1, "laptop", "Laptop" },
                    { 2, "cpu", "Linh kiện máy tính" },
                    { 3, "mouse", "Phụ kiện" },
                    { 4, "printer", "Thiết bị văn phòng" }
                });

            migrationBuilder.InsertData(
                table: "Customers",
                columns: new[] { "Id", "Address", "CreatedAt", "Email", "Name", "Phone" },
                values: new object[,]
                {
                    { 1, "Hà Nội", new DateTime(2024, 5, 23, 8, 0, 0, 0, DateTimeKind.Utc), "a@example.com", "Nguyễn Văn A", "0901000001" },
                    { 2, "Hà Nội", new DateTime(2024, 5, 23, 9, 0, 0, 0, DateTimeKind.Utc), "b@example.com", "Trần Thị B", "0901000002" },
                    { 3, "Hà Nội", new DateTime(2024, 5, 23, 10, 0, 0, 0, DateTimeKind.Utc), "c@example.com", "Lê Văn C", "0901000003" },
                    { 4, "Hà Nội", new DateTime(2024, 5, 23, 11, 0, 0, 0, DateTimeKind.Utc), "d@example.com", "Phạm Thị D", "0901000004" },
                    { 5, "Hà Nội", new DateTime(2024, 5, 23, 12, 0, 0, 0, DateTimeKind.Utc), "e@example.com", "Hoàng Văn E", "0901000005" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "FullName", "PasswordHash", "Role", "UserName" },
                values: new object[] { 1, new DateTime(2024, 5, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Admin", "91C1042178F5ED4A7D83E023772157BEC94C04C8C9526B02494FAC2AFAB3D2CA", 1, "admin" });

            migrationBuilder.InsertData(
                table: "Orders",
                columns: new[] { "Id", "Code", "CustomerId", "OrderedAt", "Status", "TotalAmount" },
                values: new object[,]
                {
                    { 1, "DH10045", 1, new DateTime(2024, 5, 23, 14, 30, 0, 0, DateTimeKind.Utc), 1, 15490000m },
                    { 2, "DH10044", 2, new DateTime(2024, 5, 23, 14, 15, 0, 0, DateTimeKind.Utc), 2, 2390000m },
                    { 3, "DH10043", 3, new DateTime(2024, 5, 23, 13, 50, 0, 0, DateTimeKind.Utc), 3, 950000m },
                    { 4, "DH10042", 4, new DateTime(2024, 5, 23, 13, 20, 0, 0, DateTimeKind.Utc), 4, 350000m },
                    { 5, "DH10041", 5, new DateTime(2024, 5, 23, 12, 45, 0, 0, DateTimeKind.Utc), 1, 25880000m }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "CostPrice", "Description", "ImageUrl", "Name", "Price", "Sku", "Status", "StockQuantity" },
                values: new object[,]
                {
                    { 1, 1, 18000000m, "Laptop văn phòng hiệu năng ổn định", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=760&q=80", "Laptop Dell Inspiron 15 3520", 22500000m, "LAP-DELL-3520", 1, 36 },
                    { 2, 1, 12200000m, "Mỏng nhẹ cho học tập và làm việc", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=760&q=80", "Laptop ASUS VivoBook 15 X1504VA", 15490000m, "LAP-ASUS-X1504VA", 1, 42 },
                    { 3, 3, 220000m, "Chuột yên tĩnh cho văn phòng", "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=760&q=80", "Chuột không dây Logitech M331", 350000m, "ACC-LOGI-M331", 1, 95 },
                    { 4, 3, 690000m, "Bàn phím cơ layout gọn", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=760&q=80", "Bàn phím cơ DareU EK87", 950000m, "ACC-DAREU-EK87", 1, 64 },
                    { 5, 4, 1800000m, "Màn hình IPS 24 inch cho văn phòng", "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=760&q=80", "Màn hình LG 24MP400-B 24 inch", 2390000m, "MON-LG-24MP400", 1, 53 },
                    { 6, 2, 21700000m, "Bộ máy chơi game, thiết kế đồ họa", "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=760&q=80", "PC Gaming M2T RTX 4060", 25880000m, "PC-M2T-4060", 1, 30 }
                });

            migrationBuilder.InsertData(
                table: "InventoryTransactions",
                columns: new[] { "Id", "CreatedAt", "Note", "ProductId", "Quantity", "Type" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 5, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Seed laptop stock", 1, 120, 1 },
                    { 2, new DateTime(2024, 5, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Seed component stock", 6, 320, 1 },
                    { 3, new DateTime(2024, 5, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Seed accessory stock", 3, 260, 1 },
                    { 4, new DateTime(2024, 5, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Seed office device stock", 5, 150, 1 }
                });

            migrationBuilder.InsertData(
                table: "OrderItems",
                columns: new[] { "Id", "LineTotal", "OrderId", "ProductId", "Quantity", "UnitPrice" },
                values: new object[,]
                {
                    { 1, 15490000m, 1, 2, 1, 15490000m },
                    { 2, 2390000m, 2, 5, 1, 2390000m },
                    { 3, 950000m, 3, 4, 1, 950000m },
                    { 4, 350000m, 4, 3, 1, 350000m },
                    { 5, 25880000m, 5, 6, 1, 25880000m },
                    { 6, 225000000m, 1, 1, 15, 15000000m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactions_ProductId",
                table: "InventoryTransactions",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Code",
                table: "Orders",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerId",
                table: "Orders",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Sku",
                table: "Products",
                column: "Sku",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName",
                table: "Users",
                column: "UserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InventoryTransactions");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
