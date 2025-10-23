import { useNavigate } from "react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { markNotificationAsRead } from "@/services/notification-socket.service";
import type { Notification } from "@/store/notification.store";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (notification.category === "payment") {
      if (!notification.read) {
        // navigate(`/dashboard/wallet`, { state: { fromNotification: true } });
        markNotificationAsRead(notification._id);
      }
      return;
    }

    if (notification.category === "interview") {
      if (!notification.read) {
        navigate(`/dashboard/interviews`);
        markNotificationAsRead(notification._id);
      }
      return;
    }

    if (notification.type === "job_expired") {
      if (!notification.read) {
        markNotificationAsRead(notification._id);
      }
      return;
    }

    switch (notification.type) {
      case "application_submitted":
        navigate(`/dashboard/applications`);
        break;

      case "job_application_received":
        if (notification.data?.jobId) {
          navigate(`/dashboard/applications/posts/${notification.data.jobId}`);
        }
        break;

      case "payment_received":
      case "wallet_low_balance":
        navigate(`/dashboard/wallet`);
        break;

      case "system_announcement":
      default:
        // navigate(`/dashboard/notifications`);
        break;
    }

    if (!notification.read) {
      markNotificationAsRead(notification._id);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatNotificationTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <DropdownMenuItem
      key={notification._id}
      className={cn(
        "flex items-center p-3 cursor-pointer rounded-none hover:bg-gray-50 focus:bg-gray-50",
        "h-20 mb-1",
        !notification.read && "bg-indigo-50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start w-full gap-2">
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <p
            className={cn(
              "text-sm",
              !notification.read ? "font-medium text-gray-900" : "text-gray-600"
            )}
          >
            {notification.message}
          </p>

          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">
              {formatNotificationTime(notification.createdAt)}
            </p>

            {notification.data?.priority && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  getPriorityColor(notification.data.priority)
                )}
              >
                {notification.data.priority}
              </Badge>
            )}
          </div>
        </div>

        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              markNotificationAsRead(notification._id);
            }}
            className="p-1 h-6 w-6 hover:bg-gray-200"
          >
            <Check className="w-3 h-3" />
          </Button>
        )}
      </div>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
