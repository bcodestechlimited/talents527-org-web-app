import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "@/services/notification.service";
import type {
  GetNotificationsParams,
  GetNotificationsResponse,
} from "@/types/notification";

export const useNotifications = (params?: GetNotificationsParams) => {
  return useQuery<GetNotificationsResponse>({
    queryKey: ["notifications", params],
    queryFn: () => getUserNotifications(params),
  });
};
