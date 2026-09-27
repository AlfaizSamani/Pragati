import { useCallback, useEffect, useRef, useState } from "react";

/** Tiny toast helper: `const { message, visible, toast } = useToast()` */
export default function useToast(duration = 2200) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);

  const toast = useCallback(
    (msg) => {
      setMessage(msg);
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), duration);
    },
    [duration]
  );

  useEffect(() => () => clearTimeout(timer.current), []);
  return { message, visible, toast };
}
