import Constants, { ExecutionEnvironment } from "expo-constants";
import { Platform } from "react-native";

type NotificationsModule = typeof import("expo-notifications");

async function requestPermissions(notifications: NotificationsModule): Promise<boolean> {
  const { status } = await notifications.requestPermissionsAsync();
  return status === "granted";
}

async function cancelScheduledNotifications(notifications: NotificationsModule) {
  await notifications.cancelAllScheduledNotificationsAsync();
}

interface Notification {
  title: string;
  body: string;
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const notifications: Array<Notification> = [
  {
    title: "Kickstart kvelden🎉",
    body: "Kickstart kvelden med spill i Tero appen!",
  },
  {
    title: "Klar for spill?🎮",
    body: "Samle gjengen og spill i Tero appen!",
  },
  {
    title: "Kjedelig kveld?🎲",
    body: "Trapp opp spenningen med Tero appen!",
  },
  {
    title: "Kvelden er ung🎉",
    body: "Ta en runde med Tero og sett fyr på festen!",
  },
  {
    title: "Klar for fest?🎉",
    body: "Samle gjengen og start et spill i Tero!",
  },
  {
    title: "Det er helg!🎉",
    body: "Feir helgen med spill i Tero appen!",
  },
  {
    title: "Game time!🎮",
    body: "Spill Tero med vennegjengen!",
  },
];

function randomNotification(): Notification {
  const idx = rand(0, notifications.length - 1);
  return notifications[idx];
}

async function scheduleWeeklyNotifications(notifications: NotificationsModule) {
  await cancelScheduledNotifications(notifications);

  // weekday: 6 = Friday, 7 = Saturday (Expo uses 1=Sun … 7=Sat)
  const days = [6, 7] as const;
  const earlyNotification = randomNotification();
  const lateNotification = randomNotification();

  const slots = [
    {
      hour: 19,
      minute: rand(0, 59),
      title: earlyNotification.title,
      body: earlyNotification.body,
    },
    {
      hour: 21,
      minute: rand(0, 59),
      title: lateNotification.title,
      body: lateNotification.body,
    },
  ];

  for (const weekday of days) {
    for (const slot of slots) {
      await notifications.scheduleNotificationAsync({
        content: {
          title: slot.title,
          body: slot.body,
        },
        trigger: {
          type: notifications.SchedulableTriggerInputTypes.CALENDAR,
          repeats: true,
          weekday,
          hour: slot.hour,
          minute: slot.minute,
        },
      });
    }
  }
}

export async function setupNotifications() {
  if (Platform.OS !== "ios") return;
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return;
  const notifications = await import("expo-notifications");

  notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const granted = await requestPermissions(notifications);
  if (!granted) return;
  await scheduleWeeklyNotifications(notifications);
}
