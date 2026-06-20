import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

/** Ảnh món local — Next/Image giữ chất lượng, không upscale quá mức */
export default function DishPhoto({
  src,
  alt,
  className = "object-cover",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fill = true,
  width,
  height,
}: Props) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={92}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 640}
      height={height ?? 480}
      sizes={sizes}
      quality={92}
      priority={priority}
      className={className}
    />
  );
}
