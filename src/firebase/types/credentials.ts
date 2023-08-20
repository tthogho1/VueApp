interface MessagingConfig{
    vapidKey: string;
}

interface Config{
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}

export interface Credentials {
    config: Config;
    messagingConfig: MessagingConfig;
}