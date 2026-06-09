# Repository Guidelines

## Mục Tiêu Dự Án

Dự án là website quản lý bán hàng và giới thiệu sản phẩm cho cửa hàng máy tính. Stack chính: ASP.NET Core Web API cho backend, Angular + TypeScript + Tailwind CSS cho frontend, SQL Server cho database. Giao diện cần tối giản, hiện đại, chuyên nghiệp, lấy cảm hứng từ ảnh `ChatGPT Image 22_30_52 9 thg 6, 2026.png`: sidebar/nav xanh navy, nền sáng, card trắng, viền mảnh, icon rõ ràng và CTA xanh dương.

## Cấu Trúc Dự Án

Ưu tiên cấu trúc tách rõ frontend/backend:

- `backend/`: ASP.NET Core Web API.
- `backend/Controllers/`: API endpoints.
- `backend/Models/` hoặc `backend/Entities/`: entity và domain model.
- `backend/DTOs/`: request/response DTO, không expose entity trực tiếp nếu có thể tránh.
- `backend/Data/`: `DbContext`, migrations, seed data.
- `backend/Services/`: business logic.
- `frontend/`: Angular + TypeScript + Tailwind CSS application.
- `frontend/src/app/features/`: module/page theo nghiệp vụ như products, orders, inventory, dashboard.
- `frontend/src/app/shared/`: component dùng chung, pipe, directive, guard.
- `frontend/src/assets/`: ảnh sản phẩm, logo, icon.
- `screenshots/`: ảnh kiểm tra UI desktop/mobile.

## Backend Guidelines

Dùng REST API rõ ràng: `/api/products`, `/api/orders`, `/api/categories`, `/api/inventory`. Controller chỉ nhận request, validate input cơ bản và gọi service; không đặt business logic lớn trong controller. Dùng async/await cho database I/O.

SQL Server truy cập qua Entity Framework Core. Tạo migration khi đổi schema và đặt tên có ý nghĩa, ví dụ `AddProductInventoryFields`. Connection string để trong `appsettings.Development.json` hoặc user secrets; không commit mật khẩu thật.

## Frontend Guidelines

Angular code dùng TypeScript strict mode, Tailwind CSS utility classes, và component tách nhỏ: `ProductCardComponent`, `CategoryFilterComponent`, `StatusBadgeComponent`, `DashboardMetricCardComponent`. Service gọi API đặt trong từng feature hoặc `core/api`. Dùng TypeScript interface cho DTO nhận từ backend.

UI phải giống dashboard/catalog: layout rõ, card bo góc tối đa `8px`, border `#e5eaf3`, shadow nhẹ, màu chính navy và blue. Ưu tiên Tailwind classes và shared CSS variables cho token màu/kích thước; chỉ viết CSS custom khi Tailwind không đủ rõ. Màn hình đầu tiên nên hiển thị dashboard hoặc catalog sản phẩm hữu ích, không dùng landing page marketing quá lớn.

## Lệnh Phát Triển

- Backend: `dotnet restore`, `dotnet build`, `dotnet run --project backend`.
- EF Core: `dotnet ef migrations add <Name> --project backend`, `dotnet ef database update --project backend`.
- Frontend: `cd frontend && npm install`, `npm start` hoặc `ng serve`, `npm run build`, `npm test`.

Cập nhật section này nếu tên project hoặc scripts thực tế khác.

## Quy Tắc Bắt Buộc Khi Làm UI

Sau mỗi thay đổi lớn về layout, màu sắc, typography, component hoặc responsive behavior, phải chụp screenshot mới và so sánh với ảnh thiết kế gốc. Lưu vào `screenshots/` với tên rõ như `desktop-dashboard-01.png` hoặc `mobile-products-01.png`.

Website bắt buộc mobile-friendly. Kiểm tra desktop và mobile; navigation, product card, bảng dữ liệu, filter, CTA và form không được tràn, chồng chữ hoặc gây cuộn ngang ngoài ý muốn.

Mọi section xuất hiện trên trang phải có animation khi scroll. Dùng hiệu ứng tinh tế và hỗ trợ `prefers-reduced-motion`.

## Kiểm Thử & Bàn Giao

Backend cần test service/API cho CRUD sản phẩm, đơn hàng, tồn kho và format dữ liệu. Frontend cần test logic lọc/tìm kiếm, render product card, trạng thái tồn kho và format tiền VND. Trước khi bàn giao, chạy build/test liên quan và ghi rõ lệnh đã chạy, file đã đổi, lỗi còn lại nếu có.
