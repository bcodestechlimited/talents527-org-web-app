import { useEffect } from "react";
import { useUserStore } from "@/store/user.store";
import {
  disconnectNotificationService,
  initNotificationService,
  requestNotificationPermission,
} from "@/services/notification-socket.service";

interface AppNotificationWrapperProps {
  children: React.ReactNode;
}

const AppNotificationWrapper = ({ children }: AppNotificationWrapperProps) => {
  const { user, token } = useUserStore();

  useEffect(() => {
    if (user?.id && token) {
      console.log("Initializing notification service for user:", user.id);

      initNotificationService(user.id);

      requestNotificationPermission();

      return () => {
        disconnectNotificationService();
      };
    }
  }, [user?.id, token]);

  useEffect(() => {
    if (!user || !token) {
      disconnectNotificationService();
    }
  }, [user, token]);

  return <>{children}</>;
};

export default AppNotificationWrapper;
