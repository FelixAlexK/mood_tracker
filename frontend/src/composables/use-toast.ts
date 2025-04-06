import Toast from "@/components/toast-component.vue";
import { createApp, h } from "vue";

export function useToast() {
  const show = (message: string, type: "success" | "error" | "warning" | "info" = "info", duration = 3000) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const toastApp = createApp({
      render: () => h(Toast, {
        message,
        type,
        duration,
        onDestroy: () => {
          setTimeout(() => {
            toastApp.unmount();
            container.remove();
          }, 300);
        },
      }),
    });

    toastApp.mount(container);
  };

  return {
    success: (message: string) => show(message, "success"),
    error: (message: string) => show(message, "error"),
    warning: (message: string) => show(message, "warning"),
    info: (message: string) => show(message, "info"),
  };
}
