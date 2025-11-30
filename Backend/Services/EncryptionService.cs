using System.Security.Cryptography;
using System.Text;

namespace BarbariBahar.API.Services
{
    public interface IEncryptionService
    {
        string Encrypt(string plainText);
        string Decrypt(string cipherText);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
        string GenerateSecureToken(int length = 32);
    }

    /// <summary>
    /// سرویس برای رمزنگاری و Hash کردن داده‌های حساس
    /// </summary>
    public class EncryptionService : IEncryptionService
    {
        private readonly byte[] _encryptionKey;
        private readonly ILogger<EncryptionService> _logger;

        public EncryptionService(IConfiguration configuration, ILogger<EncryptionService> logger)
        {
            _logger = logger;
            
            // دریافت کلید رمزنگاری از Environment Variable
            var keyString = Environment.GetEnvironmentVariable("ENCRYPTION_KEY") 
                ?? configuration["EncryptionSettings:Key"];

            if (string.IsNullOrEmpty(keyString) || keyString.Length < 32)
            {
                throw new InvalidOperationException(
                    "Encryption key must be at least 32 characters. Set ENCRYPTION_KEY environment variable.");
            }

            // تبدیل به byte array با طول 32 (256 bit)
            _encryptionKey = DeriveKeyFromString(keyString, 32);
        }

        /// <summary>
        /// رمزنگاری متن با AES-256
        /// </summary>
        public string Encrypt(string plainText)
        {
            if (string.IsNullOrEmpty(plainText))
                return plainText;

            try
            {
                using var aes = Aes.Create();
                aes.Key = _encryptionKey;
                aes.GenerateIV();

                var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using var ms = new MemoryStream();
                // ذخیره IV در ابتدای Stream
                ms.Write(aes.IV, 0, aes.IV.Length);

                using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                using (var sw = new StreamWriter(cs))
                {
                    sw.Write(plainText);
                }

                return Convert.ToBase64String(ms.ToArray());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error encrypting data");
                throw new InvalidOperationException("خطا در رمزنگاری داده", ex);
            }
        }

        /// <summary>
        /// رمزگشایی متن با AES-256
        /// </summary>
        public string Decrypt(string cipherText)
        {
            if (string.IsNullOrEmpty(cipherText))
                return cipherText;

            try
            {
                var fullCipher = Convert.FromBase64String(cipherText);

                using var aes = Aes.Create();
                aes.Key = _encryptionKey;

                // خواندن IV از ابتدای داده
                var iv = new byte[aes.IV.Length];
                Array.Copy(fullCipher, 0, iv, 0, iv.Length);
                aes.IV = iv;

                var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using var ms = new MemoryStream(fullCipher, iv.Length, fullCipher.Length - iv.Length);
                using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
                using var sr = new StreamReader(cs);

                return sr.ReadToEnd();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error decrypting data");
                throw new InvalidOperationException("خطا در رمزگشایی داده", ex);
            }
        }

        /// <summary>
        /// Hash کردن رمز عبور با PBKDF2
        /// </summary>
        public string HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new ArgumentNullException(nameof(password));

            // تولید Salt تصادفی
            byte[] salt = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Hash با PBKDF2 (100000 iterations)
            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
            byte[] hash = pbkdf2.GetBytes(32);

            // ترکیب Salt و Hash
            byte[] hashBytes = new byte[48]; // 16 bytes salt + 32 bytes hash
            Array.Copy(salt, 0, hashBytes, 0, 16);
            Array.Copy(hash, 0, hashBytes, 16, 32);

            return Convert.ToBase64String(hashBytes);
        }

        /// <summary>
        /// تایید رمز عبور
        /// </summary>
        public bool VerifyPassword(string password, string hash)
        {
            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(hash))
                return false;

            try
            {
                // استخراج Salt و Hash
                byte[] hashBytes = Convert.FromBase64String(hash);
                
                byte[] salt = new byte[16];
                Array.Copy(hashBytes, 0, salt, 0, 16);

                byte[] storedHash = new byte[32];
                Array.Copy(hashBytes, 16, storedHash, 0, 32);

                // محاسبه Hash برای رمز ورودی
                var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
                byte[] computedHash = pbkdf2.GetBytes(32);

                // مقایسه با روش امن (Constant Time)
                return CryptographicOperations.FixedTimeEquals(storedHash, computedHash);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// تولید توکن امن تصادفی
        /// </summary>
        public string GenerateSecureToken(int length = 32)
        {
            var randomBytes = new byte[length];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        /// <summary>
        /// تبدیل رشته به کلید با طول مشخص
        /// </summary>
        private byte[] DeriveKeyFromString(string keyString, int keyLength)
        {
            using var sha256 = SHA256.Create();
            var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(keyString));
            
            if (hash.Length >= keyLength)
            {
                return hash.Take(keyLength).ToArray();
            }
            
            // اگر طول کم است، تکرار می‌کنیم
            var result = new byte[keyLength];
            var offset = 0;
            
            while (offset < keyLength)
            {
                var remaining = keyLength - offset;
                var toCopy = Math.Min(remaining, hash.Length);
                Array.Copy(hash, 0, result, offset, toCopy);
                offset += toCopy;
            }
            
            return result;
        }
    }
}
