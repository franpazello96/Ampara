using Microsoft.AspNetCore.Mvc;
using AmparaCRUDApi.Models;
using AmparaCRUDApi.Data;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AmparaCRUDApi.Models.Entities;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(ApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpOptions("login")]
    public IActionResult PreflightLogin()
    {
        Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
        Response.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return NoContent();
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {

        Console.WriteLine("Tentativa de login com email: " + request.Email + ", senha: " + request.Password);
        var donator = _context.Donators
            .FirstOrDefault(u => u.Email == request.Email && u.Password == request.Password);

        if (donator != null)
        {
            var token = GenerateJwtTokenForDonator(donator);
            return Ok(new { token, userType = "donator" });
        }

        var donee = _context.Donees
           .FirstOrDefault(u => u.Email == request.Email && u.Password == request.Password && u.CNPJ != null);


        if (donee != null)
        {
            var token = GenerateJwtTokenForDonee(donee);
            return Ok(new { token, userType = "donee" });
        }

        return Unauthorized(new { message = "Credenciais inválidas." });
    }

    private string GenerateJwtTokenForDonator(Donator donator)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, donator.Email),
            new Claim("cpf", donator.CPF),
            new Claim("role", "donator"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        return GenerateToken(claims);
    }

    private string GenerateJwtTokenForDonee(Donee donee)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, donee.Email),
            new Claim("cnpj", donee.CNPJ),
            new Claim("role", "donee"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        return GenerateToken(claims);
    }
    private string GenerateToken(Claim[] claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
