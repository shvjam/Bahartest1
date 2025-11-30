namespace BarbariBahar.API.Utils
{
    public static class TypeConverterExtensions
    {
        public static double? ToDouble(this decimal? value)
        {
            return value.HasValue ? (double?)value.Value : null;
        }

        public static double ToDouble(this decimal value)
        {
            return (double)value;
        }

        public static decimal ToDecimal(this double value)
        {
            return (decimal)value;
        }
        
        public static decimal? ToDecimal(this double? value)
        {
            return value.HasValue ? (decimal?)value.Value : null;
        }
        
        public static int? ToInt(this decimal? value)
        {
            return value.HasValue ? (int?)value.Value : null;
        }
        
        public static int ToInt(this decimal value)
        {
            return (int)value;
        }
    }
}
