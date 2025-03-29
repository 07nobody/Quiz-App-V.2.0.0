import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

function LottiePlayer({ src, background, speed, loop, autoplay, style }) {
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      const animation = lottie.loadAnimation({
        container: container.current,
        renderer: "svg",
        loop: loop,
        autoplay: autoplay,
        path: src,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      });

      animation.setSpeed(speed || 1);

      return () => {
        animation.destroy();
      };
    }
  }, [src, loop, autoplay, speed]);

  return (
    <div
      ref={container}
      style={{
        background: background || "transparent",
        ...style,
      }}
    ></div>
  );
}

export default LottiePlayer;