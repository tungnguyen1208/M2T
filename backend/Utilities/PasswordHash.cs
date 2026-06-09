using System.Security.Cryptography;
using System.Text;

namespace POS365Computer.Api.Utilities;

public static class PasswordHash
{
    private const string Salt = "POS365ComputerSeed";

    public static string Create(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes($"{Salt}:{password}"));
        return Convert.ToHexString(bytes);
    }

    public static bool Verify(string password, string hash) =>
        string.Equals(Create(password), hash, StringComparison.OrdinalIgnoreCase);
}
