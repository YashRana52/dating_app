import { NAV_ITEMS } from "@/lib/common-utils";
import { UserProfile } from "@/lib/types";
import { User } from "firebase/auth";
import { Flame, Heart, MessageCircle, Settings, UserIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveNavigationProps {
  user: User;
  profile: UserProfile;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function ResponsiveNavigation({
  user,
  profile,
  activeTab,
  onTabChange,
}: ResponsiveNavigationProps) {
  const iconMap = {
    Flame,
    Heart,
    MessageCircle,
    UserIcon,
  };

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    Icon: iconMap[item.icon as keyof typeof iconMap] || UserIcon,
  }));

  // Desktop Sidebar – Ultra Modern Glass + Neon Gradient
  const DesktopSidebar = () => (
    <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-80 z-40">
      {/* Gradient base */}
      <div className="absolute inset-0  bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950 opacity-90" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      {/* Glass container */}
      <div className="relative w-full bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-[0_0_80px_rgba(236,72,153,0.35)] flex flex-col">
        {/* Profile */}
        <div className="p-8 border-b border-white/20">
          <div className="flex items-center gap-5 mb-6">
            {profile.photos?.[0] ? (
              <div className="relative">
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white/30 shadow-xl"
                />
                {profile.isOnline && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full ring-4 ring-white" />
                )}
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-white/80" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">
                {profile.name}
              </h2>
              {profile.isOnline && (
                <p className="text-emerald-200 text-sm mt-1">● Online</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center gap-2 text-white font-medium shadow-lg">
              <Flame className="w-5 h-5 text-orange-300" />
              Boost
            </button>
            <button className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all shadow-lg">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-6">
          <div className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 group",
                  activeTab === item.id
                    ? "bg-white/30 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    : "hover:bg-white/15 hover:scale-[1.03]"
                )}
              >
                <item.Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                <span className="text-lg font-medium text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );

  // Mobile Bottom Navigation (Inspired by modern dating apps – clean icons with subtle active indicator)
  const MobileBottomNav = () => (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50">
      {/* Glassmorphic bar with soft blur */}
      <div className="bg-white/10 backdrop-blur-2xl border-t border-white/20">
        <div className="flex justify-around items-center py-3 px-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-300",
                activeTab === item.id ? "text-white" : "text-white/70"
              )}
            >
              <item.Icon className="w-7 h-7" />
              <span className="text-xs font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full opacity-50" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Safe area for notched devices */}
      <div className="h-4 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileBottomNav />
    </>
  );
}

export default ResponsiveNavigation;
