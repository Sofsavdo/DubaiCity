import { useLocation } from "wouter";
import { Home, Building, CheckSquare, ShoppingCart, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/business", icon: Building, label: "Business" },
  { path: "/tasks", icon: CheckSquare, label: "Tasks" },
  { path: "/shop", icon: ShoppingCart, label: "Shop" },
  { path: "/profile", icon: User, label: "Profile" },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <div className="bg-dubai-overlay backdrop-blur-sm border-t border-gray-700">
      <div className="flex justify-around py-3">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={`nav-button ${location === path ? 'active' : ''}`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
