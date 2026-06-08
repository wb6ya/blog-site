export default function Loading() {
  return (
    <div className="min-h-screen pt-32 pb-24 flex justify-center items-start">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col gap-12">
        
        {/* Hero Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-16 pt-8">
          <div className="flex-1 w-full space-y-6">
            <div className="h-8 w-32 bg-surface/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="space-y-3">
              <div className="h-12 w-4/5 bg-surface/50 rounded-xl animate-pulse" style={{ animationDelay: '100ms' }}></div>
              <div className="h-12 w-3/5 bg-surface/40 rounded-xl animate-pulse" style={{ animationDelay: '200ms' }}></div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-surface/30 rounded-lg animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="h-4 w-4/5 bg-surface/30 rounded-lg animate-pulse" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="h-[50vh] bg-surface/40 rounded-3xl animate-pulse border border-glass-border" style={{ animationDelay: '150ms' }}></div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`rounded-3xl border border-glass-border overflow-hidden ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              style={{ animationDelay: `${500 + i * 100}ms` }}
            >
              <div className={`bg-surface/40 animate-pulse ${i === 0 ? 'h-[420px]' : 'h-[260px]'}`}></div>
              <div className="p-6 space-y-3 bg-surface/20">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 bg-surface/50 rounded-full animate-pulse"></div>
                  <div className="flex gap-1">
                    <div className="h-5 w-14 bg-surface/40 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="h-6 w-3/4 bg-surface/50 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-surface/30 rounded animate-pulse"></div>
                  <div className="h-3 w-5/6 bg-surface/30 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shimmer overlay effect */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    </div>
  );
}
