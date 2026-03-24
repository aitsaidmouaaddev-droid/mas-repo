const CodeEditorSkeleton = ({ className }: { className?: string }) => {
  // Common styles to ensure consistency
  const skeletonBase = {
    backgroundColor: '#1e1e1e', // Standard VS Code / One Dark background
    borderRadius: '8px',
    border: '1px solid #333',
    overflow: 'hidden',
    fontFamily: 'monospace',
    width: '100%',
  };

  const toolbarStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    height: '40px',
    backgroundColor: '#252525',
    borderBottom: '1px solid #333',
    gap: '8px',
  };

  const dotStyle = (color: string) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color,
    opacity: 0.8,
  });

  const bodyStyle = {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  };

  return (
    <div style={skeletonBase} className={className}>
      {/* Mock Toolbar */}
      <div style={toolbarStyle}>
        <div style={dotStyle('#ff5f56')} />
        <div style={dotStyle('#ffbd2e')} />
        <div style={dotStyle('#27c93f')} />

        {/* Filename placeholder */}
        <div
          style={{
            marginLeft: '12px',
            width: '80px',
            height: '10px',
            background: '#444',
            borderRadius: '4px',
          }}
          className="pulse"
        />
      </div>

      {/* Mock Editor Body */}
      <div style={bodyStyle}>
        {[80, 45, 60, 90, 30, 70].map((width, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Line Number */}
            <div
              style={{ width: '20px', height: '12px', background: '#333', borderRadius: '2px' }}
            />
            {/* Code Line */}
            <div
              className="pulse"
              style={{
                width: `${width}%`,
                height: '12px',
                background: '#3a3a3a',
                borderRadius: '4px',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes skeleton-pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }
        .pulse {
          animation: skeleton-pulse 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CodeEditorSkeleton;
