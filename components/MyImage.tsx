export type Props = {
  alt: string;
  src: string;
  id?: string;
  srcSet?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
};

export default function MyImage({
  alt,
  src,
  id,
  srcSet,
  className,
  style,
  width,
  height,
}: Props) {
  return (
    <img
      id={id}
      src={src}
      srcSet={srcSet}
      alt={alt}
      className={className}
      style={style}
      loading='lazy'
      width={width}
      height={height}
    />
  );
}
