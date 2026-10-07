export default function Message({ type = 'error', children }) {
  if (!children) return null;
  return (
    <p className={`message message--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
