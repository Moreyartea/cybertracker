import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.moreyartea.cybertracker",
  appName: "Cyber Security Tracker",
  webDir: "out",
  backgroundColor: "#0c0d10",
  server: {
    androidScheme: "https",
  },
};

export default config;
