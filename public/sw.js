/* eslint-env serviceworker */

function receivePushNotification(event) {
  console.log("[Service Worker] Push Received");
  poshelNahui(event);
  const {
    image, tag, url, title, text,
  } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag,
    image,
    badge: "https://spyna.it/icons/favicon.ico",
    actions: [
      {
        action: "Detail",
        title: "View",
        icon: "https://via.placeholder.com/128/ff0000",
      },
    ],
  };
  event.waitUntil(async () => {
    self.registration.showNotification(
      title,
      options,
    ); /* eslint-disable-line no-restricted-globals */
  });
}

async function poshelNahui(event) {
  console.log("idu");
  console.log(event.data.json());
  self.clients.matchAll().then((
    all, /* eslint-disable-line no-restricted-globals */
  ) => all.forEach((client) => {
    client.postMessage({
      msg: event.data.json().text,
      url: "url",
    });
  }));
  // event.waitUntil(async () => {
  //   const client = await clients.get(event.clientId);
  //   // Exit early if we don't get the client.
  //   // Eg, if it closed.
  //   if (!client) return;

  //   // Send a message to the client.
  //   client.postMessage({
  //     msg: "Hey I just got a fetch from you!",
  //     url: event.request.url
  //   });
  // });
}

function openPushNotification(event) {
  console.log(
    "[Service Worker] Notification click Received.",
    event.notification.data,
  );

  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

// self.addEventListener("fetch", poshelNahui);
self.addEventListener(
  "push",
  receivePushNotification,
); /* eslint-disable-line no-restricted-globals */
self.addEventListener(
  "notificationclick",
  openPushNotification,
); /* eslint-disable-line no-restricted-globals */
