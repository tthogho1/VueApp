importScripts('https://www.gstatic.com/firebasejs/8.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3/firebase-messaging.js');


firebase.initializeApp({
    apiKey: "AIzaSyAj4nPbZtJhoMO7PQHe7R3R_0LcxT-TsuM",
    projectId:"sample-app-936fd",
    messagingSenderId: "366241129706",
    appId: "1:366241129706:web:64b30f59f57451f177e393"
});

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    var notificationTitle = payload.notification.title;
    var notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
    });