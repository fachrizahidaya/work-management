import { createContext, useContext, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const WebsocketContext = createContext();

export function WebsocketContextProvider({ children }) {
  window.Pusher = Pusher;

  const [laravelEcho, setLaravelEcho] = useState(null);

  const echo = new Echo({
    broadcaster: process.env.EXPO_PUBLIC_WS_BROADCASTER,
    key: process.env.EXPO_PUBLIC_WS_KEY,
    wsHost: process.env.EXPO_PUBLIC_WS_HOST,
    wsPort: process.env.EXPO_PUBLIC_WS_PORT,
    wssport: process.env.EXPO_PUBLIC_WSS_PORT,
    transports: process.env.EXPO_PUBLIC_WS_TRANSPORT?.split(","),
    enabledTransports: process.env.EXPO_PUBLIC_WS_ENABLED_TRANSPORT?.split(","),
    forceTLS: process.env.EXPO_PUBLIC_WS_FORCE_TLS,
    disableStats: process.env.EXPO_PUBLIC_WS_DISABLE_STATS,
    cluster: process.env.EXPO_PUBLIC_WS_CLUSTER,
  });

  if (!laravelEcho) {
    setLaravelEcho(echo);
  }

  return <WebsocketContext.Provider value={{ laravelEcho, setLaravelEcho }}>{children}</WebsocketContext.Provider>;
}

export function useWebsocketContext() {
  return useContext(WebsocketContext);
}
