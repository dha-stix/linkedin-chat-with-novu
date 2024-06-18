import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from "@novu/notification-center";

export default function NovuBell({subscriberID}: {subscriberID: string}) {
    return (
        <NovuProvider
      subscriberId={subscriberID}
      applicationIdentifier={process.env.NEXT_PUBLIC_APP_ID!}
    >
      <PopoverNotificationCenter colorScheme="light">
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
    )
}