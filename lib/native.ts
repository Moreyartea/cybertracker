import { Capacitor } from "@capacitor/core";

const isNative = () =>
  typeof window !== "undefined" && Capacitor.isNativePlatform();

// Getar halus saat centang, getar sukses saat stage selesai. Diam di browser.
export async function haptic(kind: "light" | "success" = "light") {
  if (!isNative()) return;
  try {
    const { Haptics, ImpactStyle, NotificationType } = await import(
      "@capacitor/haptics"
    );
    if (kind === "success") {
      await Haptics.notification({ type: NotificationType.Success });
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch {
    // plugin belum ter-sync — abaikan
  }
}

// Status bar gelap + tombol Back Android. onBack mengembalikan true jika sudah
// menangani Back sendiri (mis. menutup stage); false = keluar dari aplikasi.
export async function setupNative(onBack: () => boolean) {
  if (!isNative()) return () => {};
  let remove = () => {};
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0C0D10" });
    const { App } = await import("@capacitor/app");
    const handle = await App.addListener("backButton", () => {
      if (!onBack()) App.exitApp();
    });
    remove = () => handle.remove();
  } catch {
    // abaikan
  }
  return remove;
}
