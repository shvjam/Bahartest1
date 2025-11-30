# 📡 SignalR Hubs - Real-Time Communication

این پوشه شامل **SignalR Hubs** برای ارتباطات Real-Time در سیستم باربری بهار است.

---

## 📁 ساختار

```
Hubs/
├── LocationTrackingHub.cs    ✅ Live Location Tracking
└── README.md                  (این فایل)
```

---

## 🎯 LocationTrackingHub

**مسیر:** `/hubs/location-tracking`  
**Authentication:** Required (JWT)

### **قابلیت‌ها:**

1. ✅ **Real-Time Location Updates** - به‌روزرسانی لحظه‌ای موقعیت راننده
2. ✅ **Order Tracking** - ردیابی سفارش توسط مشتری
3. ✅ **ETA Calculation** - محاسبه خودکار زمان رسیدن
4. ✅ **Geofencing** - هشدار نزدیک شدن به مقصد
5. ✅ **Group Management** - گروه‌بندی بر اساس سفارش
6. ✅ **Messaging** - چت بین مشتری و راننده
7. ✅ **Location History** - تاریخچه مسیر
8. ✅ **Driver Status** - وضعیت راننده (در حرکت، توقف، etc.)

---

## 🔌 Connection

### **URL:**
```
ws://localhost:5000/hubs/location-tracking?access_token=YOUR_JWT_TOKEN
```

### **JavaScript/TypeScript:**
```typescript
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`http://localhost:5000/hubs/location-tracking?access_token=${token}`)
  .withAutomaticReconnect()
  .build();

await connection.start();
```

---

## 📊 Methods Overview

| Method | Role | Description |
|--------|------|-------------|
| `StartTrackingOrder` | Customer/Admin | شروع ردیابی سفارش |
| `StopTrackingOrder` | Customer/Admin | توقف ردیابی سفارش |
| `UpdateLocation` | Driver | به‌روزرسانی موقعیت |
| `GetLocationHistory` | All | دریافت تاریخچه موقعیت‌ها |
| `NotifyOrderStatusChange` | System | اطلاع تغییر وضعیت |
| `UpdateDriverStatus` | Driver | به‌روزرسانی وضعیت راننده |
| `SendMessage` | All | ارسال پیام |

---

## 📨 Events Overview

| Event | Description |
|-------|-------------|
| `Connected` | اتصال برقرار شد |
| `OrderTrackingStarted` | ردیابی سفارش شروع شد |
| `LocationUpdated` | موقعیت به‌روز شد |
| `DriverNearDestination` | راننده نزدیک مقصد است |
| `OrderStatusChanged` | وضعیت سفارش تغییر کرد |
| `DriverStatusChanged` | وضعیت راننده تغییر کرد |
| `MessageReceived` | پیام جدید دریافت شد |
| `Error` | خطا رخ داد |

---

## 🔐 Security

### **Authentication:**
- همه متدها نیاز به JWT Token دارند
- Token در query string ارسال می‌شود

### **Authorization:**
- `UpdateLocation` - فقط Driver
- `UpdateDriverStatus` - فقط Driver
- دسترسی به سفارش‌ها بر اساس UserId چک می‌شود

---

## 🚀 مثال استفاده

### **Customer - ردیابی سفارش:**
```typescript
// شروع ردیابی
await connection.invoke("StartTrackingOrder", orderId);

// دریافت موقعیت
connection.on("LocationUpdated", (data) => {
  console.log("Location:", data.location);
  console.log("ETA:", data.eta, "minutes");
  updateMap(data.location.latitude, data.location.longitude);
});

// هشدار نزدیک شدن
connection.on("DriverNearDestination", (data) => {
  alert(`راننده ${data.distanceInMeters} متر فاصله دارد!`);
});
```

### **Driver - ارسال موقعیت:**
```typescript
// ارسال موقعیت هر 5 ثانیه
setInterval(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    connection.invoke("UpdateLocation",
      orderId,
      position.coords.latitude,
      position.coords.longitude,
      position.coords.speed,
      position.coords.heading,
      position.coords.accuracy
    );
  });
}, 5000);

// به‌روزرسانی وضعیت
await connection.invoke("UpdateDriverStatus", "در حال حرکت", orderId);
```

---

## 📊 Connection Management

### **Concurrent Connections:**
هر کاربر می‌تواند چندین Connection داشته باشد (مثلاً از چند دستگاه مختلف)

### **Connection Storage:**
اطلاعات Connection ها در `ConcurrentDictionary` ذخیره می‌شود:
```csharp
{
  ConnectionId: {
    UserId,
    UserRole,
    IsDriver,
    DriverId,
    ActiveOrderId,
    LastLocation,
    ConnectedAt
  }
}
```

### **Auto Cleanup:**
- وقتی کاربر disconnect می‌شود، اطلاعات او پاک می‌شود
- اگر راننده disconnect شود، به سفارش‌های مربوطه اطلاع داده می‌شود

---

## 🧪 تست

### **تست با Postman:**
1. ابتدا JWT Token بگیرید از `/api/auth/verify-otp`
2. از Postman WebSocket Request استفاده کنید
3. URL: `ws://localhost:5000/hubs/location-tracking?access_token=YOUR_TOKEN`

### **تست با Browser Console:**
```javascript
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/hubs/location-tracking?access_token=YOUR_TOKEN")
  .build();

await connection.start();
await connection.invoke("StartTrackingOrder", "order-guid-here");
```

---

## 🗺️ Distance Calculation

**Haversine Formula** برای محاسبه فاصله:
```csharp
var R = 6371; // شعاع زمین (کیلومتر)
var distance = R * c; // فاصله به کیلومتر
```

**ETA Calculation:**
```csharp
var etaMinutes = (distance / averageSpeed) * 60;
// فرض: سرعت متوسط 30 کیلومتر در ساعت
```

---

## 🔄 Reconnection

SignalR به طور خودکار تلاش می‌کند در صورت قطع شدن، مجدداً وصل شود:

```typescript
.withAutomaticReconnect({
  nextRetryDelayInMilliseconds: (retryContext) => {
    // Exponential backoff
    return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
  }
})
```

---

## 📈 Performance

### **Update Frequency:**
- **Driver Location:** هر 5 ثانیه (قابل تنظیم)
- **Keep-Alive:** هر 10 ثانیه
- **Timeout:** 30 ثانیه

### **Optimization:**
- استفاده از Groups برای کاهش broadcast
- فقط به کسانی که سفارش را track می‌کنند ارسال می‌شود
- Location Updates فقط در زمان فعال بودن سفارش

---

## 🎯 Use Cases

### **1. Customer App:**
- ردیابی لحظه‌ای راننده روی نقشه
- نمایش ETA
- دریافت اعلان نزدیک شدن راننده
- چت با راننده

### **2. Driver App:**
- ارسال خودکار موقعیت
- به‌روزرسانی وضعیت
- دریافت پیام از مشتری

### **3. Admin Panel:**
- نظارت بر همه سفارش‌های فعال
- مشاهده موقعیت تمام راننده‌ها
- تحلیل مسیرها

---

## 📚 مستندات بیشتر

- [SIGNALR_LIVE_TRACKING.md](../Docs/SIGNALR_LIVE_TRACKING.md) - مستندات کامل API
- [SIGNALR_REACT_EXAMPLE.tsx](../Docs/SIGNALR_REACT_EXAMPLE.tsx) - مثال React
- [SignalR Documentation](https://learn.microsoft.com/en-us/aspnet/core/signalr/)

---

**✅ SignalR Hub کامل و آماده برای استفاده است!**
