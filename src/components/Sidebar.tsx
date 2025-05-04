
import { Link } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, GraduationCap, User, LogOut, Settings, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Sidebar() {
  // Remove the useAuth hook and related logic
  // Instead of conditional rendering based on user role, show all menu items
  
  return (
    <aside className="fixed left-0 top-0 z-30 h-full w-[60px] border-r bg-background md:w-[250px]">
      <header className="flex h-[60px] items-center justify-between px-3">
        <Link to="/" className="text-xl font-bold">
          MediSync
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon profil</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <nav className="flex flex-col">
        <Link
          to="/"
          className="flex h-[60px] items-center gap-4 border-b px-6 text-foreground/60 transition-colors hover:text-foreground"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="hidden md:inline-block">Tableau de bord</span>
        </Link>

        <Link
          to="/onboardings"
          className="flex h-[60px] items-center gap-4 border-b px-6 text-foreground/60 transition-colors hover:text-foreground"
        >
          <Users className="h-5 w-5" />
          <span className="hidden md:inline-block">Onboardings</span>
        </Link>

        <Link
          to="/calendar"
          className="flex h-[60px] items-center gap-4 border-b px-6 text-foreground/60 transition-colors hover:text-foreground"
        >
          <Calendar className="h-5 w-5" />
          <span className="hidden md:inline-block">Calendrier</span>
        </Link>

        <Link
          to="/training"
          className="flex h-[60px] items-center gap-4 border-b px-6 text-foreground/60 transition-colors hover:text-foreground"
        >
          <GraduationCap className="h-5 w-5" />
          <span className="hidden md:inline-block">Formations</span>
        </Link>

        <Link
          to="/chatbot"
          className="flex h-[60px] items-center gap-4 border-b px-6 text-foreground/60 transition-colors hover:text-foreground"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden md:inline-block">Chatbot</span>
        </Link>
      </nav>
    </aside>
  );
}
