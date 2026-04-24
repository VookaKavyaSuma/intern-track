const Spinner = ({ size = 40, className = '' }) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80, 200"
          strokeDashoffset="0"
        />
      </svg>
    </div>
  );
};

export default Spinner;
