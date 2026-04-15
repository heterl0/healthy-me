import { useEffect } from "react";

type Params = {
  isBlocked: boolean;
  message?: string;
};

const DEFAULT_MESSAGE =
  "Your report is still being generated. Are you sure you want to leave this page?";

export function useNavigationGuard({
  isBlocked,
  message = DEFAULT_MESSAGE,
}: Params) {
  useEffect(() => {
    if (!isBlocked) {
      return;
    }

    // Push a temporary history entry so back/forward can be intercepted.
    window.history.pushState(null, "", window.location.href);

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    const onPopState = () => {
      const shouldLeave = window.confirm(message);
      if (!shouldLeave) {
        window.history.pushState(null, "", window.location.href);
      } else {
        window.removeEventListener("beforeunload", onBeforeUnload);
        window.removeEventListener("popstate", onPopState);
        window.history.back();
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onPopState);
    };
  }, [isBlocked, message]);
}
