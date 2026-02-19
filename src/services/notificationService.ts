const ICON = "/icons/icon-192x192.png";

export const isNotificationSupported = (): boolean =>
  typeof window !== "undefined" && "Notification" in window;

export const getNotificationPermission = (): NotificationPermission | null => {
  if (!isNotificationSupported()) return null;
  return Notification.permission;
};

export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!isNotificationSupported()) return "denied";
    return Notification.requestPermission();
  };

export const sendNotification = (
  title: string,
  body: string,
  navigateTo: string,
): void => {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;

  const notification = new Notification(title, {
    body,
    icon: ICON,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = navigateTo;
    notification.close();
  };
};

export const sendImageNotification = (prompt: string): void => {
  sendNotification(
    "Dude - Immagine pronta! 🎨",
    prompt.length > 80 ? prompt.slice(0, 77) + "..." : prompt,
    "/gallery?tab=images",
  );
};

export const sendVideoNotification = (prompt: string): void => {
  sendNotification(
    "Dude - Video pronto! 🎬",
    prompt.length > 80 ? prompt.slice(0, 77) + "..." : prompt,
    "/gallery?tab=videos",
  );
};
