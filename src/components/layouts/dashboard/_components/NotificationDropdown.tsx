import { Bell, CheckCheck } from "lucide-react";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotificationStore } from "@/store/notification.store";

import {
  getNotificationStats,
  getUserNotifications,
} from "@/services/notification.service";
import {
  markAllNotificationsAsRead,
  requestNotificationPermission,
} from "@/services/notification-socket.service";
import NotificationItem from "./NavigationItem";

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    setNotifications,
    setStats,
    setLoading,
    isLoading,
  } = useNotificationStore();

  const [isOpen, setIsOpen] = useState(false);

  const { data: notificationData, isLoading: isFetchingNotifications } =
    useQuery({
      queryKey: ["notifications", { limit: 20 }],
      queryFn: () => getUserNotifications({ limit: 20 }),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    });

  const { data: statsData } = useQuery({
    queryKey: ["notification-stats"],
    queryFn: getNotificationStats,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (notificationData?.data) {
      setNotifications(notificationData.data.notifications);
    }
  }, [notificationData, setNotifications]);

  useEffect(() => {
    if (statsData?.data) {
      setStats(statsData.data);
    }
  }, [statsData, setStats]);

  useEffect(() => {
    setLoading(isFetchingNotifications);
  }, [isFetchingNotifications, setLoading]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
  };

  const LoadingSkeleton = () => (
    <div className="p-4 space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start space-x-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 rounded-full bg-indigo-100 hover:bg-gray-100 transition"
        >
          <Bell className="size-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center rounded-full justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-100 max-h-96 mt-2 overflow-y-auto p-0 shadow-sm rounded-none"
      >
        <div className="flex items-center justify-between px-2 py-1">
          <DropdownMenuLabel className="text-base">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {isLoading ? (
          <LoadingSkeleton />
        ) : notifications.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))}

            {notifications.length > 10 && (
              <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-800">
                View all notifications
              </DropdownMenuItem>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
