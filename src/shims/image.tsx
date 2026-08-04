import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  draggable?: boolean;
  [key: string]: unknown;
};

/** next/image shim → plain <img>. `fill` maps to an absolutely-positioned, full-size image. */
export default function Image({
  src,
  alt = "",
  className,
  style,
  fill,
  width,
  height,
  priority,
  sizes: _sizes,
  draggable,
  ...rest
}: Props) {
  const s: CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
    : style ?? {};
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={s}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      draggable={draggable}
      {...(rest as Record<string, unknown>)}
    />
  );
}
