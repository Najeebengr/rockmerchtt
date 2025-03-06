export default function ProgressBar({ current, total, uploading }) {
  const percentage = Math.round((current / total) * 100) || 0;
  
  return (
    <div className="progress-container">
      <div className="progress-stats">
        <span>{current} of {total} {uploading ? 'in progress' : 'completed'}</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${percentage === 100 ? 'complete' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {uploading && percentage < 100 && (
        <div className="progress-detail">
          <span>Please don't close this window</span>
          <span>Estimated time remaining: {Math.ceil((total - current) / 10)} minutes</span>
        </div>
      )}
      <style jsx>{`
        .progress-container {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .progress-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #4a5568;
          font-size: 14px;
        }
        .progress-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s ease;
        }
        .progress-fill.complete {
          background: #48bb78;
        }
        .progress-detail {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          color: #718096;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
} 