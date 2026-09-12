/** Screen-reader-only text. Used for the lightbox counter announcement etc. */
export default function VisuallyHidden({ as: Tag = 'span', children, ...rest }) {
  return (
    <Tag className="sr-only" {...rest}>
      {children}
    </Tag>
  );
}
