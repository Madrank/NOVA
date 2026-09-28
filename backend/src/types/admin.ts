export type UserRole = 'client' | 'professional' | 'admin';

export interface AdminOverview {
  users: { total: number; clients: number; professionals: number; admins: number };
  bookings: { total: number; pending: number; confirmed: number; cancelled: number; completed: number };
  revenueCents: number;
  content: { servicesActive: number; servicesTotal: number; establishments: number; professionalsActive: number };
  recentBookings: AdminBooking[];
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  createdAt: string;
}

export interface AdminBooking {
  id: string;
  status: string;
  startsAt: string;
  endsAt: string;
  price: number;
  createdAt: string;
  client: { firstName: string; lastName: string };
  service: { slug: string; name: string };
  professional: { firstName: string; lastName: string };
}

export interface AdminService {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  active: boolean;
  professional: { firstName: string; lastName: string };
  establishment: { name: string; city: string } | null;
}