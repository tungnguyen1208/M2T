using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using POS365Computer.Api.DTOs;
using POS365Computer.Api.Services;

namespace POS365Computer.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var response = await authService.LoginAsync(request);
        return response is null ? Unauthorized(new ApiError("Tên đăng nhập hoặc mật khẩu không đúng.")) : Ok(response);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AuthUserDto>> Me()
    {
        var idValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idValue, out var id))
        {
            return Unauthorized(new ApiError("Token không hợp lệ."));
        }

        var user = await authService.GetUserAsync(id);
        return user is null ? Unauthorized(new ApiError("Người dùng không tồn tại.")) : Ok(user);
    }
}
