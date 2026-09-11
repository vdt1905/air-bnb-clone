export default function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="py-24 text-center">
      <p className="text-body text-ink">{message ?? 'Something went wrong.'}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-card bg-control px-6 py-3 text-body font-medium text-ink transition-colors duration-300 ease-airbnb hover:bg-control-hover"
        >
          Try again
        </button>
      )}
    </div>
  );
}
