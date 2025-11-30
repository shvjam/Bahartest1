import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  User,
  FileText,
  Settings,
  Upload,
  Download,
  Users,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from 'sonner';
import { Driver, VehicleType, Order, OrderStatus } from '../../types';

// Mock data - باید از API بیاد
const mockDrivers: Driver[] = [
  {
    id: '1',
    fullName: 'احمد محمدی',
    phoneNumber: '09121234567',
    nationalId: '0123456789',
    role: 'DRIVER' as any,
    dateOfBirth: new Date('1985-05-15'),
    address: 'تهران، منطقه 5، خیابان آزادی',
    licensePlate: '12-345-ج-67',
    vehicleType: VehicleType.PICKUP,
    vehicleModel: 'نیسان زامیاد',
    vehicleColor: 'سفید',
    vehicleYear: 2020,
    availableWorkers: 2,
    driverLicenseNumber: 'DL-123456',
    driverLicenseExpiry: new Date('2026-12-31'),
    profileImage: '',
    documentsVerified: true,
    verifiedAt: new Date('2024-01-15'),
    sheba: 'IR123456789012345678901234',
    rating: 4.8,
    totalRides: 256,
    completedRides: 245,
    cancelledRides: 5,
    totalEarnings: 125000000,
    isActive: true,
    isAvailable: true,
    isOnline: true,
    commissionPercentage: 20,
    priority: 1,
    currentLocation: {
      latitude: 35.6892,
      longitude: 51.3890,
      lat: 35.6892,
      lng: 51.3890,
      lastUpdate: new Date(),
    },
    createdAt: new Date('2023-06-01'),
    assignments: [],
  },
  {
    id: '2',
    fullName: 'حسین رضایی',
    phoneNumber: '09129876543',
    nationalId: '9876543210',
    role: 'DRIVER' as any,
    dateOfBirth: new Date('1990-08-20'),
    address: 'تهران، منطقه 2، خیابان ولیعصر',
    licensePlate: '98-765-الف-43',
    vehicleType: VehicleType.NISSAN,
    vehicleModel: 'نیسان',
    vehicleColor: 'آبی',
    vehicleYear: 2019,
    availableWorkers: 3,
    driverLicenseNumber: 'DL-987654',
    driverLicenseExpiry: new Date('2027-06-30'),
    profileImage: '',
    documentsVerified: true,
    verifiedAt: new Date('2024-02-10'),
    sheba: 'IR987654321098765432109876',
    rating: 4.5,
    totalRides: 180,
    completedRides: 172,
    cancelledRides: 3,
    totalEarnings: 89000000,
    isActive: true,
    isAvailable: false,
    isOnline: false,
    commissionPercentage: 18,
    priority: 2,
    createdAt: new Date('2023-08-15'),
    assignments: [],
  },
  {
    id: '3',
    fullName: 'علی کریمی',
    phoneNumber: '09135556677',
    nationalId: '5556667777',
    role: 'DRIVER' as any,
    dateOfBirth: new Date('1988-03-10'),
    address: 'تهران، منطقه 3، خیابان انقلاب',
    licensePlate: '55-666-ب-77',
    vehicleType: VehicleType.TRUCK,
    vehicleModel: 'ایسوزو',
    vehicleColor: 'سبز',
    vehicleYear: 2021,
    availableWorkers: 1,
    driverLicenseNumber: 'DL-555666',
    driverLicenseExpiry: new Date('2025-12-31'),
    profileImage: '',
    documentsVerified: false,
    sheba: 'IR555666777888999000111222',
    rating: 4.2,
    totalRides: 95,
    completedRides: 88,
    cancelledRides: 2,
    totalEarnings: 52000000,
    isActive: true,
    isAvailable: true,
    isOnline: true,
    commissionPercentage: 22,
    priority: 3,
    createdAt: new Date('2024-01-20'),
    assignments: [],
  },
];

const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'c1',
    customerPhone: '09121111111',
    customerName: 'مریم احمدی',
    serviceCategoryId: 's1',
    driverId: '1',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2025-11-05 10:00'),
    createdAt: new Date('2025-11-04'),
    completedAt: new Date('2025-11-05 14:30'),
    estimatedPrice: 2500000,
    finalPrice: 2500000,
    details: {
      needsPacking: false,
      needsWorkers: true,
      workerCount: 2,
      vehicleType: VehicleType.PICKUP,
    },
    items: [],
    locationDetails: {
      orderId: '1',
      originFloor: 2,
      originHasElevator: false,
      originWalkingDistance: 10,
      destinationFloor: 3,
      destinationHasElevator: true,
      destinationWalkingDistance: 10,
      walkDistanceMeters: 10,
      stopCount: 0,
    },
    originAddress: {
      id: 'a1',
      userId: 'c1',
      title: 'منزل',
      fullAddress: 'تهران، منطقه 5، خیابان آزادی',
      lat: 35.6892,
      lng: 51.3890,
      district: '5',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a2',
      userId: 'c1',
      title: 'منزل جدید',
      fullAddress: 'تهران، منطقه 3، خیابان انقلاب',
      lat: 35.7089,
      lng: 51.4011,
      district: '3',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 8.5,
    estimatedDuration: 45,
    rating: 5,
  },
  {
    id: '2',
    customerId: 'c2',
    customerPhone: '09122222222',
    customerName: 'علی رضایی',
    serviceCategoryId: 's1',
    driverId: '1',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2025-11-03 14:00'),
    createdAt: new Date('2025-11-02'),
    completedAt: new Date('2025-11-03 17:00'),
    estimatedPrice: 3200000,
    finalPrice: 3200000,
    details: {
      needsPacking: true,
      needsWorkers: true,
      workerCount: 3,
      vehicleType: VehicleType.NISSAN,
    },
    items: [],
    locationDetails: {
      orderId: '2',
      originFloor: 4,
      originHasElevator: true,
      originWalkingDistance: 15,
      destinationFloor: 1,
      destinationHasElevator: false,
      destinationWalkingDistance: 10,
      walkDistanceMeters: 15,
      stopCount: 1,
    },
    originAddress: {
      id: 'a3',
      userId: 'c2',
      title: 'منزل قدیم',
      fullAddress: 'تهران، منطقه 2، خیابان ولیعصر',
      lat: 35.7219,
      lng: 51.4056,
      district: '2',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a4',
      userId: 'c2',
      title: 'منزل جدید',
      fullAddress: 'تهران، منطقه 1، خیابان پاسداران',
      lat: 35.7515,
      lng: 51.4679,
      district: '1',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 12.3,
    estimatedDuration: 60,
    rating: 4,
  },
  {
    id: '3',
    customerId: 'c3',
    customerPhone: '09123333333',
    customerName: 'فاطمه کریمی',
    serviceCategoryId: 's2',
    driverId: '1',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2025-11-01 09:00'),
    createdAt: new Date('2025-10-31'),
    completedAt: new Date('2025-11-01 11:30'),
    estimatedPrice: 1800000,
    finalPrice: 1800000,
    details: {
      needsPacking: false,
      needsWorkers: false,
      workerCount: 0,
      vehicleType: VehicleType.PICKUP,
    },
    items: [],
    locationDetails: {
      orderId: '3',
      originFloor: 0,
      originHasElevator: false,
      originWalkingDistance: 5,
      destinationFloor: 0,
      destinationHasElevator: false,
      destinationWalkingDistance: 5,
      walkDistanceMeters: 5,
      stopCount: 0,
    },
    originAddress: {
      id: 'a5',
      userId: 'c3',
      title: 'فروشگاه',
      fullAddress: 'تهران، منطقه 6، میدان انقلاب',
      lat: 35.7008,
      lng: 51.3912,
      district: '6',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a6',
      userId: 'c3',
      title: 'انبار',
      fullAddress: 'تهران، منطقه 12، اتوبان ته��ان-کرج',
      lat: 35.7219,
      lng: 51.2456,
      district: '12',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 18.7,
    estimatedDuration: 35,
    rating: 5,
  },
  {
    id: '4',
    customerId: 'c4',
    customerPhone: '09124444444',
    customerName: 'محمد حسینی',
    serviceCategoryId: 's1',
    driverId: '2',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2025-10-28 15:00'),
    createdAt: new Date('2025-10-27'),
    completedAt: new Date('2025-10-28 19:00'),
    estimatedPrice: 4500000,
    finalPrice: 4500000,
    details: {
      needsPacking: true,
      needsWorkers: true,
      workerCount: 4,
      vehicleType: VehicleType.TRUCK,
    },
    items: [],
    locationDetails: {
      orderId: '4',
      originFloor: 5,
      originHasElevator: true,
      originWalkingDistance: 20,
      destinationFloor: 2,
      destinationHasElevator: true,
      destinationWalkingDistance: 15,
      walkDistanceMeters: 20,
      stopCount: 0,
    },
    originAddress: {
      id: 'a7',
      userId: 'c4',
      title: 'آپارتمان',
      fullAddress: 'تهران، منطقه 3، میدان ونک',
      lat: 35.7575,
      lng: 51.4089,
      district: '3',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a8',
      userId: 'c4',
      title: 'خانه ویلایی',
      fullAddress: 'کرج، فردیس، بلوار شهید بهشتی',
      lat: 35.7453,
      lng: 50.9597,
      district: '1',
      city: 'کرج',
      province: 'البرز',
      createdAt: new Date(),
    },
    distanceKm: 35.2,
    estimatedDuration: 90,
    rating: 5,
  },
  {
    id: '5',
    customerId: 'c5',
    customerPhone: '09125555555',
    customerName: 'زهرا مرادی',
    serviceCategoryId: 's3',
    driverId: '1',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2025-10-25 11:00'),
    createdAt: new Date('2025-10-24'),
    completedAt: new Date('2025-10-25 13:00'),
    estimatedPrice: 2100000,
    finalPrice: 2100000,
    details: {
      needsPacking: false,
      needsWorkers: true,
      workerCount: 2,
      vehicleType: VehicleType.PICKUP,
    },
    items: [],
    locationDetails: {
      orderId: '5',
      originFloor: 1,
      originHasElevator: false,
      destinationFloor: 3,
      destinationHasElevator: false,
      walkDistanceMeters: 8,
      stopCount: 0,
      originWalkingDistance: 8,
      destinationWalkingDistance: 10,
    },
    originAddress: {
      id: 'a9',
      userId: 'c5',
      title: 'دفتر کار',
      fullAddress: 'تهران، منطقه 7، خیابان کارگر',
      lat: 35.6961,
      lng: 51.4231,
      district: '7',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a10',
      userId: 'c5',
      title: 'دفتر جدید',
      fullAddress: 'تهران، منطقه 5، خیابان مطهری',
      lat: 35.7178,
      lng: 51.4267,
      district: '5',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 6.8,
    estimatedDuration: 30,
    rating: 4,
  },
  {
    id: '6',
    customerId: 'c6',
    customerPhone: '09126666666',
    customerName: 'حسن قاسمی',
    serviceCategoryId: 's1',
    driverId: '2',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2025-10-22 08:00'),
    createdAt: new Date('2025-10-21'),
    completedAt: new Date('2025-10-22 12:00'),
    estimatedPrice: 3800000,
    finalPrice: 3800000,
    details: {
      needsPacking: true,
      needsWorkers: true,
      workerCount: 3,
      vehicleType: VehicleType.NISSAN,
    },
    items: [],
    locationDetails: {
      orderId: '6',
      originFloor: 3,
      originHasElevator: false,
      destinationFloor: 4,
      destinationHasElevator: true,
      walkDistanceMeters: 12,
      stopCount: 1,
      originWalkingDistance: 12,
      destinationWalkingDistance: 15,
    },
    originAddress: {
      id: 'a11',
      userId: 'c6',
      title: 'منزل',
      fullAddress: 'تهران، منطقه 4، خیابان جمهوری',
      lat: 35.7009,
      lng: 51.4156,
      district: '4',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a12',
      userId: 'c6',
      title: 'آپارتمان جدید',
      fullAddress: 'تهران، منطقه 2، خیابان شریعتی',
      lat: 35.7456,
      lng: 51.4389,
      district: '2',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 9.5,
    estimatedDuration: 50,
    rating: 4,
  },
  {
    id: '7',
    customerId: 'c7',
    customerPhone: '09127777777',
    customerName: 'سمیرا نوری',
    serviceCategoryId: 's2',
    driverId: '1',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2025-10-20 13:00'),
    createdAt: new Date('2025-10-19'),
    completedAt: new Date('2025-10-20 15:30'),
    estimatedPrice: 1600000,
    finalPrice: 1600000,
    details: {
      needsPacking: false,
      needsWorkers: false,
      workerCount: 0,
      vehicleType: VehicleType.PICKUP,
    },
    items: [],
    locationDetails: {
      orderId: '7',
      originFloor: 0,
      originHasElevator: false,
      destinationFloor: 1,
      destinationHasElevator: false,
      walkDistanceMeters: 5,
      stopCount: 0,
      originWalkingDistance: 5,
      destinationWalkingDistance: 8,
    },
    originAddress: {
      id: 'a13',
      userId: 'c7',
      title: 'مغازه',
      fullAddress: 'تهران، منطقه 8، خیابان سپهبد قرنی',
      lat: 35.6723,
      lng: 51.3912,
      district: '8',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a14',
      userId: 'c7',
      title: 'منزل',
      fullAddress: 'تهران، منطقه 9، خیابان آیت‌الله طالقانی',
      lat: 35.6989,
      lng: 51.3723,
      district: '9',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 5.2,
    estimatedDuration: 25,
    rating: 5,
  },
  {
    id: '8',
    customerId: 'c8',
    customerPhone: '09128888888',
    customerName: 'رضا صالحی',
    serviceCategoryId: 's1',
    driverId: '3',
    status: OrderStatus.COMPLETED,
    preferredDateTime: new Date('2025-10-18 10:00'),
    createdAt: new Date('2025-10-17'),
    completedAt: new Date('2025-10-18 14:00'),
    estimatedPrice: 2900000,
    finalPrice: 2900000,
    details: {
      needsPacking: false,
      needsWorkers: true,
      workerCount: 2,
      vehicleType: VehicleType.PICKUP,
    },
    items: [],
    locationDetails: {
      orderId: '8',
      originFloor: 2,
      originHasElevator: true,
      destinationFloor: 2,
      destinationHasElevator: false,
      walkDistanceMeters: 10,
      stopCount: 0,
      originWalkingDistance: 10,
      destinationWalkingDistance: 12,
    },
    originAddress: {
      id: 'a15',
      userId: 'c8',
      title: 'خانه',
      fullAddress: 'تهران، منطقه 10، خیابان نواب',
      lat: 35.6534,
      lng: 51.3645,
      district: '10',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    destinationAddress: {
      id: 'a16',
      userId: 'c8',
      title: 'آپارتمان',
      fullAddress: 'تهران، منطقه 5، خیابان انقلاب',
      lat: 35.7089,
      lng: 51.4011,
      district: '5',
      city: 'تهران',
      province: 'تهران',
      createdAt: new Date(),
    },
    distanceKm: 11.2,
    estimatedDuration: 55,
    rating: 5,
  },
];

const vehicleTypeLabels: Record<VehicleType, string> = {
  [VehicleType.PICKUP]: 'وانت',
  [VehicleType.NISSAN]: 'نیسان',
  [VehicleType.TRUCK]: 'کامیون',
  [VehicleType.HEAVY_TRUCK]: 'خاور',
};

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'online' | 'offline'>('all');
  const [vehicleFilter, setVehicleFilter] = useState<'all' | VehicleType>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // فرم راننده
  const [driverForm, setDriverForm] = useState({
    // اطلاعات شخصی
    fullName: '',
    phoneNumber: '',
    nationalId: '',
    dateOfBirth: '',
    address: '',
    
    // وسیله نقلیه
    licensePlate: '',
    vehicleType: VehicleType.PICKUP,
    vehicleModel: '',
    vehicleColor: '',
    vehicleYear: new Date().getFullYear(),
    availableWorkers: 0,
    
    // مدارک
    driverLicenseNumber: '',
    driverLicenseExpiry: '',
    driverLicenseImage: '',
    vehicleCardImage: '',
    insuranceImage: '',
    profileImage: '',
    
    // اطلاعات بانکی
    sheba: '',
    
    // تنظیمات
    isActive: true,
    commissionPercentage: 20,
    priority: 1,
    adminNote: '',
  });

  // فیلتر رانندگان
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phoneNumber.includes(searchQuery) ||
      driver.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && driver.isActive) ||
      (statusFilter === 'inactive' && !driver.isActive) ||
      (statusFilter === 'online' && driver.isOnline) ||
      (statusFilter === 'offline' && !driver.isOnline);

    const matchesVehicle = vehicleFilter === 'all' || driver.vehicleType === vehicleFilter;

    const matchesVerified =
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && driver.documentsVerified) ||
      (verifiedFilter === 'unverified' && !driver.documentsVerified);

    return matchesSearch && matchesStatus && matchesVehicle && matchesVerified;
  });

  // محاسبه آمار
  const stats = {
    total: drivers.length,
    active: drivers.filter((d) => d.isActive).length,
    online: drivers.filter((d) => d.isOnline).length,
    verified: drivers.filter((d) => d.documentsVerified).length,
    avgRating: drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length || 0,
  };

  const handleAddDriver = () => {
    // ریست فرم
    setDriverForm({
      fullName: '',
      phoneNumber: '',
      nationalId: '',
      dateOfBirth: '',
      address: '',
      licensePlate: '',
      vehicleType: VehicleType.PICKUP,
      vehicleModel: '',
      vehicleColor: '',
      vehicleYear: new Date().getFullYear(),
      availableWorkers: 0,
      driverLicenseNumber: '',
      driverLicenseExpiry: '',
      driverLicenseImage: '',
      vehicleCardImage: '',
      insuranceImage: '',
      profileImage: '',
      sheba: '',
      isActive: true,
      commissionPercentage: 20,
      priority: 1,
      adminNote: '',
    });
    setIsAddDialogOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setDriverForm({
      fullName: driver.fullName || '',
      phoneNumber: driver.phoneNumber,
      nationalId: driver.nationalId || '',
      dateOfBirth: driver.dateOfBirth ? driver.dateOfBirth.toISOString().split('T')[0] : '',
      address: driver.address || '',
      licensePlate: driver.licensePlate,
      vehicleType: driver.vehicleType,
      vehicleModel: driver.vehicleModel || '',
      vehicleColor: driver.vehicleColor || '',
      vehicleYear: driver.vehicleYear || new Date().getFullYear(),
      availableWorkers: driver.availableWorkers,
      driverLicenseNumber: driver.driverLicenseNumber || '',
      driverLicenseExpiry: driver.driverLicenseExpiry ? driver.driverLicenseExpiry.toISOString().split('T')[0] : '',
      driverLicenseImage: driver.driverLicenseImage || '',
      vehicleCardImage: driver.vehicleCardImage || '',
      insuranceImage: driver.insuranceImage || '',
      profileImage: driver.profileImage || '',
      sheba: driver.sheba || '',
      isActive: driver.isActive,
      commissionPercentage: driver.commissionPercentage || 15,
      priority: driver.priority || 1,
      adminNote: driver.adminNote || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailsDialogOpen(true);
  };

  const handleSaveDriver = () => {
    if (isEditDialogOpen && selectedDriver) {
      // ویرایش راننده
      setDrivers(
        drivers.map((d) =>
          d.id === selectedDriver.id
            ? {
                ...d,
                fullName: driverForm.fullName,
                phoneNumber: driverForm.phoneNumber,
                nationalId: driverForm.nationalId,
                dateOfBirth: driverForm.dateOfBirth ? new Date(driverForm.dateOfBirth) : undefined,
                address: driverForm.address,
                licensePlate: driverForm.licensePlate,
                vehicleType: driverForm.vehicleType,
                vehicleModel: driverForm.vehicleModel,
                vehicleColor: driverForm.vehicleColor,
                vehicleYear: driverForm.vehicleYear,
                availableWorkers: driverForm.availableWorkers,
                driverLicenseNumber: driverForm.driverLicenseNumber,
                driverLicenseExpiry: driverForm.driverLicenseExpiry
                  ? new Date(driverForm.driverLicenseExpiry)
                  : undefined,
                driverLicenseImage: driverForm.driverLicenseImage,
                vehicleCardImage: driverForm.vehicleCardImage,
                insuranceImage: driverForm.insuranceImage,
                profileImage: driverForm.profileImage,
                sheba: driverForm.sheba,
                isActive: driverForm.isActive,
                commissionPercentage: driverForm.commissionPercentage,
                priority: driverForm.priority,
                adminNote: driverForm.adminNote,
              }
            : d
        )
      );
      toast.success('راننده با موفقیت ویرایش شد');
      setIsEditDialogOpen(false);
    } else {
      // افزودن راننده جدید
      const newDriver: Driver = {
        id: `driver-${Date.now()}`,
        fullName: driverForm.fullName,
        phoneNumber: driverForm.phoneNumber,
        nationalId: driverForm.nationalId,
        role: 'DRIVER' as any,
        dateOfBirth: driverForm.dateOfBirth ? new Date(driverForm.dateOfBirth) : undefined,
        address: driverForm.address,
        licensePlate: driverForm.licensePlate,
        vehicleType: driverForm.vehicleType,
        vehicleModel: driverForm.vehicleModel,
        vehicleColor: driverForm.vehicleColor,
        vehicleYear: driverForm.vehicleYear,
        availableWorkers: driverForm.availableWorkers,
        driverLicenseNumber: driverForm.driverLicenseNumber,
        driverLicenseExpiry: driverForm.driverLicenseExpiry
          ? new Date(driverForm.driverLicenseExpiry)
          : undefined,
        driverLicenseImage: driverForm.driverLicenseImage,
        vehicleCardImage: driverForm.vehicleCardImage,
        insuranceImage: driverForm.insuranceImage,
        profileImage: driverForm.profileImage,
        sheba: driverForm.sheba,
        documentsVerified: false,
        rating: 0,
        totalRides: 0,
        completedRides: 0,
        cancelledRides: 0,
        totalEarnings: 0,
        isActive: driverForm.isActive,
        isAvailable: true,
        isOnline: false,
        commissionPercentage: driverForm.commissionPercentage,
        priority: driverForm.priority,
        adminNote: driverForm.adminNote,
        createdAt: new Date(),
        assignments: [],
      };
      setDrivers([...drivers, newDriver]);
      toast.success('راننده جدید با موفقیت افزوده شد');
      setIsAddDialogOpen(false);
    }
  };

  const confirmDeleteDriver = () => {
    if (selectedDriver) {
      setDrivers(drivers.filter((d) => d.id !== selectedDriver.id));
      toast.success('راننده با موفقیت حذف شد');
      setIsDeleteDialogOpen(false);
      setSelectedDriver(null);
    }
  };

  const toggleDriverStatus = (driverId: string, field: 'isActive' | 'isOnline') => {
    setDrivers(
      drivers.map((d) => (d.id === driverId ? { ...d, [field]: !d[field] } : d))
    );
    toast.success(field === 'isActive' ? 'وضعیت راننده تغییر کرد' : 'وضعیت آنلاین تغییر کرد');
  };

  const verifyDriver = (driverId: string) => {
    setDrivers(
      drivers.map((d) =>
        d.id === driverId
          ? { ...d, documentsVerified: true, verifiedAt: new Date() }
          : d
      )
    );
    toast.success('مدارک راننده تایید شد');
  };

  const getDriverOrders = (driverId: string) => {
    return mockOrders.filter((o) => o.driverId === driverId);
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailsDialogOpen(true);
  };

  const getOrderStatusLabel = (status: OrderStatus) => {
    const labels: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'پیش‌نویس',
      [OrderStatus.PENDING]: 'در انتظار',
      [OrderStatus.REVIEWING]: 'در حال بررسی',
      [OrderStatus.CONFIRMED]: 'تایید شده',
      [OrderStatus.DRIVER_ASSIGNED]: 'اختصاص داده شده',
      [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'در مسیر مبدا',
      [OrderStatus.PACKING_IN_PROGRESS]: 'در حال بسته‌بندی',
      [OrderStatus.LOADING_IN_PROGRESS]: 'در حال بارگیری',
      [OrderStatus.IN_TRANSIT]: 'در حال حمل',
      [OrderStatus.IN_PROGRESS]: 'در حال انجام',
      [OrderStatus.ARRIVED_AT_DESTINATION]: 'رسیده به مقصد',
      [OrderStatus.COMPLETED]: 'تکمیل شده',
      [OrderStatus.CANCELLED]: 'لغو شده',
    };
    return labels[status] || status;
  };

  const getOrderStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.REVIEWING]: 'bg-blue-100 text-blue-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.DRIVER_ASSIGNED]: 'bg-purple-100 text-purple-800',
      [OrderStatus.DRIVER_EN_ROUTE_TO_ORIGIN]: 'bg-orange-100 text-orange-800',
      [OrderStatus.PACKING_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [OrderStatus.LOADING_IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [OrderStatus.IN_TRANSIT]: 'bg-orange-100 text-orange-800',
      [OrderStatus.IN_PROGRESS]: 'bg-orange-100 text-orange-800',
      [OrderStatus.ARRIVED_AT_DESTINATION]: 'bg-green-100 text-green-800',
      [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر و آمار */}
      <div>
        <h1>مدیریت رانندگان</h1>
        <p className="text-muted-foreground">مدیریت رانندگان، وسایل نقلیه و مدارک</p>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">کل رانندگان</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div>{stats.total}</div>
            <p className="text-xs text-muted-foreground">راننده ثبت شده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">فعال</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.active}</div>
            <p className="text-xs text-muted-foreground">راننده فعال</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">آنلاین</CardTitle>
            <MapPin className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.online}</div>
            <p className="text-xs text-muted-foreground">راننده آنلاین</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">تایید شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.verified}</div>
            <p className="text-xs text-muted-foreground">مدارک تایید شده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">میانگین امتیاز</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div>{stats.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">از 5</p>
          </CardContent>
        </Card>
      </div>

      {/* فیلترها و جستجو */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>لیست رانندگان</CardTitle>
              <CardDescription>مشاهده و مدیریت تمام رانندگان</CardDescription>
            </div>
            <Button onClick={handleAddDriver}>
              <Plus className="ml-2 h-4 w-4" />
              افزودن راننده
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* جستجو و فیلترها */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="جستجو بر اساس نام، موبایل یا پلاک..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="inactive">غیرفعال</SelectItem>
                  <SelectItem value="online">آنلاین</SelectItem>
                  <SelectItem value="offline">آفلاین</SelectItem>
                </SelectContent>
              </Select>

              <Select value={vehicleFilter} onValueChange={(value: any) => setVehicleFilter(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="نوع وسیله" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وسایل</SelectItem>
                  <SelectItem value={VehicleType.PICKUP}>وانت</SelectItem>
                  <SelectItem value={VehicleType.NISSAN}>نیسان</SelectItem>
                  <SelectItem value={VehicleType.TRUCK}>کامیون</SelectItem>
                  <SelectItem value={VehicleType.HEAVY_TRUCK}>خاور</SelectItem>
                </SelectContent>
              </Select>

              <Select value={verifiedFilter} onValueChange={(value: any) => setVerifiedFilter(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="تایید مدارک" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="verified">تایید شده</SelectItem>
                  <SelectItem value="unverified">تایید نشده</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* جدول */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">راننده</TableHead>
                    <TableHead className="text-right">تماس</TableHead>
                    <TableHead className="text-right">وسیله نقلیه</TableHead>
                    <TableHead className="text-right">آمار</TableHead>
                    <TableHead className="text-right">امتیاز</TableHead>
                    <TableHead className="text-right">درآمد</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                    <TableHead className="text-right">مدارک</TableHead>
                    <TableHead className="text-right">عملیات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        رانندەای یافت نشد
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={driver.profileImage} />
                              <AvatarFallback>
                                {driver.fullName?.substring(0, 2) || 'NN'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{driver.fullName || 'نام نامشخص'}</div>
                              <div className="text-xs text-muted-foreground">
                                {driver.nationalId || '-'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3" />
                              {driver.phoneNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-muted-foreground" />
                              <span>{vehicleTypeLabels[driver.vehicleType]}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {driver.licensePlate}
                            </div>
                            {driver.vehicleModel && (
                              <div className="text-xs text-muted-foreground">
                                {driver.vehicleModel} - {driver.vehicleYear}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {driver.availableWorkers} کارگر همراه
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div>{driver.totalRides} سفر</div>
                            <div className="text-xs text-muted-foreground">
                              {driver.completedRides} تکمیل شده
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{driver.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {(driver.totalEarnings / 1000000).toFixed(1)} م
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Badge
                              variant={driver.isActive ? 'default' : 'secondary'}
                              className="w-fit"
                            >
                              {driver.isActive ? 'فعال' : 'غیرفعال'}
                            </Badge>
                            {driver.isOnline && (
                              <Badge variant="outline" className="w-fit border-green-500 text-green-700">
                                <div className="ml-1 h-2 w-2 rounded-full bg-green-500" />
                                آنلاین
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {driver.documentsVerified ? (
                            <Badge variant="outline" className="border-green-500 text-green-700">
                              <CheckCircle className="ml-1 h-3 w-3" />
                              تایید شده
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-orange-500 text-orange-700">
                              <AlertCircle className="ml-1 h-3 w-3" />
                              در انتظار
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(driver)}>
                                <Eye className="ml-2 h-4 w-4" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditDriver(driver)}>
                                <Edit className="ml-2 h-4 w-4" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => toggleDriverStatus(driver.id, 'isActive')}
                              >
                                {driver.isActive ? (
                                  <>
                                    <XCircle className="ml-2 h-4 w-4" />
                                    غیرفعال کردن
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                    فعال کردن
                                  </>
                                )}
                              </DropdownMenuItem>
                              {!driver.documentsVerified && (
                                <DropdownMenuItem onClick={() => verifyDriver(driver.id)}>
                                  <CheckCircle className="ml-2 h-4 w-4" />
                                  تایید مدارک
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteDriver(driver)}
                                className="text-red-600"
                              >
                                <Trash2 className="ml-2 h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* تعداد نتایج */}
            <div className="text-sm text-muted-foreground">
              نمایش {filteredDrivers.length} از {drivers.length} راننده
            </div>
          </div>
        </CardContent>
      </Card>

      {/* دیالوگ افزودن/ویرایش راننده */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        setIsEditDialogOpen(open);
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? 'ویرایش راننده' : 'افزودن راننده جدید'}
            </DialogTitle>
            <DialogDescription>
              اطلاعات راننده، وسیله نقلیه و مدارک را وارد کنید
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">
                <User className="ml-2 h-4 w-4" />
                اطلاعات شخصی
              </TabsTrigger>
              <TabsTrigger value="vehicle">
                <Truck className="ml-2 h-4 w-4" />
                وسیله نقلیه
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="ml-2 h-4 w-4" />
                مدارک
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="ml-2 h-4 w-4" />
                تنظیمات
              </TabsTrigger>
            </TabsList>

            {/* اطلاعات شخصی */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">نام و نام خانوادگی *</Label>
                  <Input
                    id="fullName"
                    value={driverForm.fullName}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, fullName: e.target.value })
                    }
                    placeholder="احمد محمدی"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">شماره موبایل *</Label>
                  <Input
                    id="phoneNumber"
                    value={driverForm.phoneNumber}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, phoneNumber: e.target.value })
                    }
                    placeholder="09121234567"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">کد ملی</Label>
                  <Input
                    id="nationalId"
                    value={driverForm.nationalId}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, nationalId: e.target.value })
                    }
                    placeholder="0123456789"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">تاریخ تولد</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={driverForm.dateOfBirth}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, dateOfBirth: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sheba">شماره شبا</Label>
                  <Input
                    id="sheba"
                    value={driverForm.sheba}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, sheba: e.target.value })
                    }
                    placeholder="IR123456789012345678901234"
                    dir="ltr"
                    maxLength={26}
                  />
                  <p className="text-xs text-muted-foreground">
                    24 رقم بدون فاصله (شروع با IR)
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">آدرس</Label>
                  <Textarea
                    id="address"
                    value={driverForm.address}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, address: e.target.value })
                    }
                    placeholder="تهران، منطقه 5، خ��ابان آزادی"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* وسیله نقلیه */}
            <TabsContent value="vehicle" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">نوع وسیله نقلیه *</Label>
                  <Select
                    value={driverForm.vehicleType}
                    onValueChange={(value: VehicleType) =>
                      setDriverForm({ ...driverForm, vehicleType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VehicleType.PICKUP}>وانت</SelectItem>
                      <SelectItem value={VehicleType.NISSAN}>نیسان</SelectItem>
                      <SelectItem value={VehicleType.TRUCK}>کامیون</SelectItem>
                      <SelectItem value={VehicleType.HEAVY_TRUCK}>خاور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licensePlate">پلاک *</Label>
                  <Input
                    id="licensePlate"
                    value={driverForm.licensePlate}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, licensePlate: e.target.value })
                    }
                    placeholder="12-345-ج-67"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">مدل خودرو</Label>
                  <Input
                    id="vehicleModel"
                    value={driverForm.vehicleModel}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, vehicleModel: e.target.value })
                    }
                    placeholder="نیسان زامیاد"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleColor">رنگ</Label>
                  <Input
                    id="vehicleColor"
                    value={driverForm.vehicleColor}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, vehicleColor: e.target.value })
                    }
                    placeholder="سفید"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">سال ساخت</Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    value={driverForm.vehicleYear}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, vehicleYear: parseInt(e.target.value) })
                    }
                    placeholder="1400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableWorkers">تعداد کارگر همراه *</Label>
                  <Input
                    id="availableWorkers"
                    type="number"
                    min="0"
                    max="10"
                    value={driverForm.availableWorkers}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, availableWorkers: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    تعداد کارگرانی که می‌توانند همراه راننده باشند
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* مدارک */}
            <TabsContent value="documents" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="driverLicenseNumber">شماره گواهینامه</Label>
                  <Input
                    id="driverLicenseNumber"
                    value={driverForm.driverLicenseNumber}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, driverLicenseNumber: e.target.value })
                    }
                    placeholder="DL-123456"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverLicenseExpiry">تاریخ انقضای گواهینامه</Label>
                  <Input
                    id="driverLicenseExpiry"
                    type="date"
                    value={driverForm.driverLicenseExpiry}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, driverLicenseExpiry: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverLicenseImage">تصویر گواهینامه</Label>
                  <div className="flex gap-2">
                    <Input
                      id="driverLicenseImage"
                      value={driverForm.driverLicenseImage}
                      onChange={(e) =>
                        setDriverForm({ ...driverForm, driverLicenseImage: e.target.value })
                      }
                      placeholder="URL تصویر"
                      readOnly
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleCardImage">تصویر کارت خودرو</Label>
                  <div className="flex gap-2">
                    <Input
                      id="vehicleCardImage"
                      value={driverForm.vehicleCardImage}
                      onChange={(e) =>
                        setDriverForm({ ...driverForm, vehicleCardImage: e.target.value })
                      }
                      placeholder="URL تصویر"
                      readOnly
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceImage">تصویر بیمه‌��امه</Label>
                  <div className="flex gap-2">
                    <Input
                      id="insuranceImage"
                      value={driverForm.insuranceImage}
                      onChange={(e) =>
                        setDriverForm({ ...driverForm, insuranceImage: e.target.value })
                      }
                      placeholder="URL تصویر"
                      readOnly
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileImage">عکس پروفایل</Label>
                  <div className="flex gap-2">
                    <Input
                      id="profileImage"
                      value={driverForm.profileImage}
                      onChange={(e) =>
                        setDriverForm({ ...driverForm, profileImage: e.target.value })
                      }
                      placeholder="URL تصویر"
                      readOnly
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* تنظیمات */}
            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">وضعیت فعال</Label>
                    <div className="text-sm text-muted-foreground">
                      راننده می‌تواند سفارش بگیرد
                    </div>
                  </div>
                  <Switch
                    id="isActive"
                    checked={driverForm.isActive}
                    onCheckedChange={(checked) =>
                      setDriverForm({ ...driverForm, isActive: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commissionPercentage">درصد کمیسیون (%)</Label>
                  <Input
                    id="commissionPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={driverForm.commissionPercentage}
                    onChange={(e) =>
                      setDriverForm({
                        ...driverForm,
                        commissionPercentage: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">اولویت (1-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={driverForm.priority}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, priority: parseInt(e.target.value) })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    رانندگان با اولویت بالاتر زودتر سفارش می‌گیرند
                  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="adminNote">یادداشت ادمین</Label>
                  <Textarea
                    id="adminNote"
                    value={driverForm.adminNote}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, adminNote: e.target.value })
                    }
                    placeholder="یادداشت‌های داخلی درباره راننده..."
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
              }}
            >
              انصراف
            </Button>
            <Button onClick={handleSaveDriver}>
              {isEditDialogOpen ? 'ذخیره تغییرات' : 'افزودن راننده'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* دیالوگ حذف */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>حذف راننده</DialogTitle>
            <DialogDescription>
              آیا مطمئن هستید که می‌خواهید راننده {selectedDriver?.fullName} را حذف کنید؟
              این عمل قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              انصراف
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDriver}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* دیالوگ جزئیات */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>جزئیات راننده</DialogTitle>
            <DialogDescription>
              مشاهده اطلاعات کامل و جزئیات راننده
            </DialogDescription>
          </DialogHeader>

          {selectedDriver && (
            <div className="space-y-6">
              {/* اطلاعات کلی */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedDriver.profileImage} />
                  <AvatarFallback>
                    {selectedDriver.fullName?.substring(0, 2) || 'NN'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3>{selectedDriver.fullName}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {selectedDriver.phoneNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedDriver.nationalId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedDriver.isActive ? 'default' : 'secondary'}>
                      {selectedDriver.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                    {selectedDriver.isOnline && (
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        <div className="ml-1 h-2 w-2 rounded-full bg-green-500" />
                        آنلاین
                      </Badge>
                    )}
                    {selectedDriver.documentsVerified ? (
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        <CheckCircle className="ml-1 h-3 w-3" />
                        تایید شده
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-500 text-orange-700">
                        <AlertCircle className="ml-1 h-3 w-3" />
                        در انتظار تایید
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* آمار عملکرد */}
              <div>
                <h4 className="mb-4">آمار عملکرد</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">کل سفرها</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div>{selectedDriver.totalRides}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">تکمیل شده</CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div>{selectedDriver.completedRides}</div>
                      <p className="text-xs text-muted-foreground">
                        {((selectedDriver.completedRides / selectedDriver.totalRides) * 100 || 0).toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">امتیاز</CardTitle>
                      <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div>{selectedDriver.rating.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground">از 5</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm">کل درآمد</CardTitle>
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                      <div>{(selectedDriver.totalEarnings / 1000000).toFixed(1)} م</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* اطلاعات وسیله نقلیه */}
              <div>
                <h4 className="mb-4">اطلاعات وسیله نقلیه</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">نوع وسیله</div>
                    <div>{vehicleTypeLabels[selectedDriver.vehicleType]}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">پلاک</div>
                    <div>{selectedDriver.licensePlate}</div>
                  </div>
                  {selectedDriver.vehicleModel && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">مدل</div>
                      <div>{selectedDriver.vehicleModel}</div>
                    </div>
                  )}
                  {selectedDriver.vehicleColor && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">رنگ</div>
                      <div>{selectedDriver.vehicleColor}</div>
                    </div>
                  )}
                  {selectedDriver.vehicleYear && (
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">سال ساخت</div>
                      <div>{selectedDriver.vehicleYear}</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">تعداد کارگر همراه</div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedDriver.availableWorkers} نفر</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* اطلاعات بانکی */}
              {selectedDriver.sheba && (
                <>
                  <div>
                    <h4 className="mb-4">اطلاعات بانکی</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">شماره شبا</div>
                        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3" dir="ltr">
                          <span className="font-mono text-sm">{selectedDriver.sheba}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          برای تسویه‌حساب استفاده می‌شود
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* تاریخچه سفارشات */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h4>تاریخچه سفارشات</h4>
                  <Badge variant="outline">
                    {getDriverOrders(selectedDriver.id).length} سفارش
                  </Badge>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {getDriverOrders(selectedDriver.id).map((order) => (
                      <Card 
                        key={order.id}
                        className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">سفارش #{order.id}</span>
                                <Badge className={getOrderStatusColor(order.status)}>
                                  {getOrderStatusLabel(order.status)}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{order.customerName}</span>
                                <span>•</span>
                                <Phone className="h-3 w-3" />
                                <span>{order.customerPhone}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{order.distanceKm} کیلومتر</span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>{order.estimatedDuration} دقیقه</span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-primary">
                                  {order.finalPrice?.toLocaleString()} تومان
                                </span>
                                {order.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">{order.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mr-4 text-left">
                              {order.completedAt && (
                                <div className="text-xs text-muted-foreground">
                                  {new Date(order.completedAt).toLocaleDateString('fa-IR')}
                                </div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOrderDetails(order);
                                }}
                              >
                                <Eye className="ml-1 h-4 w-4" />
                                مشاهده
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {getDriverOrders(selectedDriver.id).length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="mb-2 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">
                          هنوز سفارشی ثبت نشده
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* دیالوگ جزئیات سفارش */}
      <Dialog open={isOrderDetailsDialogOpen} onOpenChange={setIsOrderDetailsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto" dir="rtl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  جزئیات سفارش #{selectedOrder.id}
                </DialogTitle>
                <DialogDescription>
                  اطلاعات کامل سفارش و جزئیات انجام آن
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* وضعیت و تاریخ */}
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">وضعیت سفارش</div>
                      <Badge className={`mt-1 ${getOrderStatusColor(selectedOrder.status)}`}>
                        {getOrderStatusLabel(selectedOrder.status)}
                      </Badge>
                    </div>
                    {selectedOrder.rating && (
                      <Separator orientation="vertical" className="h-10" />
                    )}
                    {selectedOrder.rating && (
                      <div>
                        <div className="text-sm text-muted-foreground">امتیاز</div>
                        <div className="mt-1 flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{selectedOrder.rating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-muted-foreground">تاریخ ثبت</div>
                    <div className="mt-1">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* اطلاعات مشتری */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    اطلاعات مشتری
                  </h4>
                  <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">نام مشتری</div>
                      <div className="font-medium">{selectedOrder.customerName}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">شماره تماس</div>
                      <div className="font-medium" dir="ltr">
                        {selectedOrder.customerPhone}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* آدرس‌ها */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    مبدا و مقصد
                  </h4>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">مبدا</div>
                          <div className="font-medium">{selectedOrder.originAddress.title}</div>
                        </div>
                      </div>
                      <p className="mr-10 text-sm text-muted-foreground">
                        {selectedOrder.originAddress.fullAddress}
                      </p>
                      {selectedOrder.locationDetails && (
                        <div className="mr-10 mt-2 flex gap-4 text-xs text-muted-foreground">
                          <span>طبقه: {selectedOrder.locationDetails.originFloor}</span>
                          <span>•</span>
                          <span>
                            آسانسور: {selectedOrder.locationDetails.originHasElevator ? 'دارد' : 'ندارد'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                          <MapPin className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">مقصد</div>
                          <div className="font-medium">{selectedOrder.destinationAddress.title}</div>
                        </div>
                      </div>
                      <p className="mr-10 text-sm text-muted-foreground">
                        {selectedOrder.destinationAddress.fullAddress}
                      </p>
                      {selectedOrder.locationDetails && (
                        <div className="mr-10 mt-2 flex gap-4 text-xs text-muted-foreground">
                          <span>طبقه: {selectedOrder.locationDetails.destinationFloor}</span>
                          <span>•</span>
                          <span>
                            آسانسور:{' '}
                            {selectedOrder.locationDetails.destinationHasElevator ? 'دارد' : 'ندارد'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border bg-muted/50 p-3">
                        <div className="text-sm text-muted-foreground">مسافت</div>
                        <div className="mt-1 flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">{selectedOrder.distanceKm} کیلومتر</span>
                        </div>
                      </div>
                      <div className="rounded-lg border bg-muted/50 p-3">
                        <div className="text-sm text-muted-foreground">زمان تخمینی</div>
                        <div className="mt-1 flex items-center gap-1">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium">{selectedOrder.estimatedDuration} دقیقه</span>
                        </div>
                      </div>
                      {selectedOrder.locationDetails && selectedOrder.locationDetails.stopCount > 0 && (
                        <div className="rounded-lg border bg-muted/50 p-3">
                          <div className="text-sm text-muted-foreground">توقف‌های میانی</div>
                          <div className="mt-1 font-medium">
                            {selectedOrder.locationDetails.stopCount} توقف
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* جزئیات خدمات */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    جزئیات خدمات
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">نوع وسیله نقلیه</div>
                      <div className="mt-1 font-medium">
                        {vehicleTypeLabels[selectedOrder.details.vehicleType]}
                      </div>
                    </div>
                    {selectedOrder.details.needsWorkers && (
                      <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">تعداد کارگر</div>
                        <div className="mt-1 flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{selectedOrder.details.workerCount} نفر</span>
                        </div>
                      </div>
                    )}
                    {selectedOrder.details.needsPacking && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <div className="text-sm text-blue-600">خدمات بسته‌بندی</div>
                        <div className="mt-1 font-medium text-blue-900">درخواست شده</div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* اطلاعات مالی */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    اطلاعات مالی
                  </h4>
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">قیمت تخمینی</span>
                      <span>{selectedOrder.estimatedPrice?.toLocaleString()} تومان</span>
                    </div>
                    {selectedOrder.finalPrice && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="font-medium">قیمت نهایی</span>
                          <span className="font-medium text-primary">
                            {selectedOrder.finalPrice.toLocaleString()} تومان
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* زمان‌بندی */}
                {(selectedOrder.preferredDateTime || selectedOrder.completedAt) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        زمان‌بندی
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {selectedOrder.preferredDateTime && (
                          <div className="rounded-lg border p-4">
                            <div className="text-sm text-muted-foreground">زمان درخواستی</div>
                            <div className="mt-1 font-medium">
                              {new Date(selectedOrder.preferredDateTime).toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                              {' - '}
                              {new Date(selectedOrder.preferredDateTime).toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        )}
                        {selectedOrder.completedAt && (
                          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="text-sm text-green-600">زمان تکمیل</div>
                            <div className="mt-1 font-medium text-green-900">
                              {new Date(selectedOrder.completedAt).toLocaleDateString('fa-IR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                              {' - '}
                              {new Date(selectedOrder.completedAt).toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOrderDetailsDialogOpen(false)}>
                  بستن
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
