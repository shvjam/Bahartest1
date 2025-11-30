using BarbariBahar.API.Models.ApiResponses;
using Microsoft.EntityFrameworkCore;

namespace BarbariBahar.API.Helpers
{
    /// <summary>
    /// Extension Methods برای IQueryable
    /// </summary>
    public static class QueryableExtensions
    {
        /// <summary>
        /// صفحه‌بندی خودکار
        /// </summary>
        public static async Task<PaginatedResponse<T>> ToPaginatedListAsync<T>(
            this IQueryable<T> source,
            int pageNumber,
            int pageSize) where T : class
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var count = await source.CountAsync();
            var items = await source
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResponse<T>(items, count, pageNumber, pageSize);
        }

        /// <summary>
        /// صفحه‌بندی با پارامترهای PaginationParams
        /// </summary>
        public static async Task<PaginatedResponse<T>> ToPaginatedListAsync<T>(
            this IQueryable<T> source,
            PaginationParams paginationParams) where T : class
        {
            return await source.ToPaginatedListAsync(
                paginationParams.PageNumber,
                paginationParams.PageSize
            );
        }

        /// <summary>
        /// مرتب‌سازی داینامیک
        /// </summary>
        public static IQueryable<T> ApplySorting<T>(
            this IQueryable<T> source,
            string? sortBy,
            bool descending = false)
        {
            if (string.IsNullOrWhiteSpace(sortBy))
                return source;

            // استفاده از Reflection برای مرتب‌سازی داینامیک
            var propertyInfo = typeof(T).GetProperty(sortBy);
            if (propertyInfo == null)
                return source;

            var parameter = System.Linq.Expressions.Expression.Parameter(typeof(T), "x");
            var property = System.Linq.Expressions.Expression.Property(parameter, propertyInfo);
            var lambda = System.Linq.Expressions.Expression.Lambda(property, parameter);

            var methodName = descending ? "OrderByDescending" : "OrderBy";
            var resultExpression = System.Linq.Expressions.Expression.Call(
                typeof(Queryable),
                methodName,
                new Type[] { typeof(T), propertyInfo.PropertyType },
                source.Expression,
                System.Linq.Expressions.Expression.Quote(lambda)
            );

            return source.Provider.CreateQuery<T>(resultExpression);
        }

        /// <summary>
        /// جستجوی ساده در فیلدهای متنی
        /// </summary>
        public static IQueryable<T> Search<T>(
            this IQueryable<T> source,
            string? searchTerm,
            params System.Linq.Expressions.Expression<Func<T, string>>[] searchFields)
        {
            if (string.IsNullOrWhiteSpace(searchTerm) || searchFields.Length == 0)
                return source;

            var parameter = System.Linq.Expressions.Expression.Parameter(typeof(T), "x");
            System.Linq.Expressions.Expression? predicate = null;

            foreach (var field in searchFields)
            {
                var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) })!;
                var property = field.Body;
                var nullCheck = System.Linq.Expressions.Expression.NotEqual(
                    property,
                    System.Linq.Expressions.Expression.Constant(null, typeof(string))
                );
                var containsCall = System.Linq.Expressions.Expression.Call(
                    property,
                    containsMethod,
                    System.Linq.Expressions.Expression.Constant(searchTerm)
                );
                var combined = System.Linq.Expressions.Expression.AndAlso(nullCheck, containsCall);

                predicate = predicate == null
                    ? combined
                    : System.Linq.Expressions.Expression.OrElse(predicate, combined);
            }

            if (predicate != null)
            {
                var lambda = System.Linq.Expressions.Expression.Lambda<Func<T, bool>>(predicate, parameter);
                source = source.Where(lambda);
            }

            return source;
        }

        /// <summary>
        /// اعمال فیلتر به صورت شرطی
        /// </summary>
        public static IQueryable<T> WhereIf<T>(
            this IQueryable<T> source,
            bool condition,
            System.Linq.Expressions.Expression<Func<T, bool>> predicate)
        {
            return condition ? source.Where(predicate) : source;
        }
    }
}
