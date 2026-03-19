import { useNavigate } from 'react-router-dom';
import { Home, Ticket, PlusCircle, MapPin, User, Bell, Inbox, HeartHandshake } from 'lucide-react';

interface BottomNavProps {
  active: 'home' | 'bookings' | 'create' | 'trips' | 'profile' | 'notifications' | 'requests' | 'support';
  isDriver?: boolean;
}

const BottomNav = ({ active, isDriver = false }: BottomNavProps) => {
  const navigate = useNavigate();

  const passengerItems = [
    { id: 'home' as const, label: 'Início', icon: Home, path: '/home' },
    { id: 'bookings' as const, label: 'Reservas', icon: Ticket, path: '/my-bookings' },
    { id: 'notifications' as const, label: 'Avisos', icon: Bell, path: '/notifications?role=passageiro' },
    { id: 'profile' as const, label: 'Perfil', icon: User, path: '/profile?role=passageiro' },
  ];

  const driverItems = [
    { id: 'trips' as const, label: 'Caronas', icon: MapPin, path: '/my-trips' },
    { id: 'create' as const, label: 'Criar', icon: PlusCircle, path: '/create-trip' },
    { id: 'requests' as const, label: 'Pedidos', icon: Inbox, path: '/driver-requests' },
    { id: 'notifications' as const, label: 'Avisos', icon: Bell, path: '/notifications?role=motorista' },
    { id: 'profile' as const, label: 'Perfil', icon: User, path: '/profile?role=motorista' },
  ];

  const items = isDriver ? driverItems : passengerItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
