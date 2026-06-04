import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  Mail,
  CheckSquare,
  Bot,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Meeting Summarizer", url: "/meetings", icon: FileText },
  { title: "Email Assistant", url: "/email", icon: Mail },
  { title: "Task Manager", url: "/tasks", icon: CheckSquare },
  { title: "AI Assistant", url: "/assistant", icon: Bot },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-sidebar-foreground">
            ProductivityAI
          </span>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-2",
                          isActive && "font-medium"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
