import * as Notifications from "expo-notifications";
import Constants, { ExecutionEnvironment } from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

async function cancelScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

interface Notification {
  title: string;
  body: string;
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const notifications: Array<Notification> = [
  {
    title: "🍻Kickstart vorset🍻",
    body: "Kickstart kvelden med drikkeleker i tero appen!",
  },
  {
    title: "🍻Drikkelek?🍻",
    body: "Få fart på drikkingen i tero appen!",
  },
  {
    title: "🍻Kjedelig vors?🍻",
    body: "Trapp opp spenningen med tero appen!",
  },
  {
    title: "🍻Kvelden er ung🍻",
    body: "Ta en runde med Tero og sett fyr på festen!",
  },
  {
    title: "🍻Klar for fest?🍻",
    body: "Samle gjengen og start en drikkelek i Tero!",
  },
  {
    title: "🍻Det er helg!🍻",
    body: "Feir helgen med drikkeleker i Tero appen!",
  },
  {
    title: "🍻Cheers!🍻",
    body: "Løft glasset og spill Tero med vennegjengen!",
  },
];

function randomNotification(): Notification {
  const idx = rand(0, notifications.length - 1);
  return notifications[idx];
}

async function scheduleWeeklyNotifications() {
  await cancelScheduledNotifications();

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
      await Notifications.scheduleNotificationAsync({
        content: {
          title: slot.title,
          body: slot.body,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
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
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return;
  const granted = await requestPermissions();
  if (!granted) return;
  await scheduleWeeklyNotifications();
}
