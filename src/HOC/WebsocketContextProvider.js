import { createContext, useContext, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const WebsocketContext = createContext();

export function WebsocketContextProvider({ children }) {
  window.Pusher = Pusher;

  const [laravelEcho, setLaravelEcho] = useState(null);

  const echo = new Echo({
    broadcaster: "pusher",
    key: "kssapp",
    wsHost: "api-dev.ksshub.com",
    wsPort: 6001,
    wssport: 6001,
    transports: ["websocket"],
    enabledTransports: ["ws", "wss"],
    forceTLS: false,
    disableStats: true,
    cluster: "mt1",
  });

  if (!laravelEcho) {
    setLaravelEcho(echo);
  }

  return <WebsocketContext.Provider value={{ laravelEcho, setLaravelEcho }}>{children}</WebsocketContext.Provider>;
}

export function useWebsocketContext() {
  return useContext(WebsocketContext);
}
