namespace BarbariBahar.API.Extensions
{
    /// <summary>
    /// Extension methods برای تبدیل Type-safe
    /// </summary>
    public static class TypeConverterExtensions
    {
        /// <summary>
        /// تبدیل decimal? به double?
        /// </summary>
        public static double? ToDouble(this decimal? value)
        {
            return value.HasValue ? (double)value.Value : null;
        }

        /// <summary>
        /// تبدیل decimal به double
        /// </summary>
        public static double ToDouble(this decimal value)
        {
            return (double)value;
        }

        /// <summary>
        /// تبدیل decimal? به int?
        /// </summary>
        public static int? ToInt(this decimal? value)
        {
            return value.HasValue ? (int)value.Value : null;
        }

        /// <summary>
        /// تبدیل decimal به int
        /// </summary>
        public static int ToInt(this decimal value)
        {
            return (int)value;
        }

        /// <summary>
        /// تبدیل int? به decimal?
        /// </summary>
        public static decimal? ToDecimal(this int? value)
        {
            return value.HasValue ? (decimal)value.Value : null;
        }

        /// <summary>
        /// تبدیل int به decimal
        /// </summary>
        public static decimal ToDecimal(this int value)
        {
            return (decimal)value;
        }

        /// <summary>
        /// تبدیل double? به decimal?
        /// </summary>
        public static decimal? ToDecimal(this double? value)
        {
            return value.HasValue ? (decimal)value.Value : null;
        }

        /// <summary>
        /// تبدیل double به decimal
        /// </summary>
        public static decimal ToDecimal(this double value)
        {
            return (decimal)value;
        }
    }
}
