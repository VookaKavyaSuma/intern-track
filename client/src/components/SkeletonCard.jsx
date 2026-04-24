const shimmerStyle = {
  background:
    'linear-gradient(90deg, var(--bg-glass) 0%, rgba(255,255,255,0.06) 50%, var(--bg-glass) 100%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
  borderRadius: 'var(--radius-sm)',
};

const SkeletonCard = () => {
  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      {/* Title bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ ...shimmerStyle, width: '40%', height: '1.2rem' }} />
        <div style={{ ...shimmerStyle, width: '20%', height: '1.2rem', borderRadius: '9999px' }} />
      </div>
      {/* Subtitle */}
      <div style={{ ...shimmerStyle, width: '60%', height: '0.9rem', marginBottom: '0.75rem' }} />
      {/* Body lines */}
      <div style={{ ...shimmerStyle, width: '100%', height: '0.75rem', marginBottom: '0.5rem' }} />
      <div style={{ ...shimmerStyle, width: '80%', height: '0.75rem' }} />
    </div>
  );
};

export default SkeletonCard;
