export const common = { title: "FabInsta", PRIMARY_COLOR: "#FF6F61" };

// export const backendUrl = "http://136.185.1.251:3500/api";
export const backendUrl = "http://192.168.1.15:8080/api";
// export const backendUrl = "http://192.168.1.12:8080/api";
// export const backendUrl = "https://uat.fabinsta.com/api";

import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();
