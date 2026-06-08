export default function Loading() {
  return (
    <div className="min-h-screen relative pb-32">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-brand/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Skeleton */}
      <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center">
        <div className="relative z-10 container max-w-4xl mx-auto px-4 mt-20">
          <div className="bg-surface/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center flex flex-col items-center border border-glass-border">
            {/* Tags */}
            <div className="flex gap-2 mb-6">
              <div className="h-6 w-16 bg-surface/50 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="h-6 w-20 bg-surface/50 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
            </div>
            
            {/* Title */}
            <div className="space-y-3 w-full mb-8">
              <div className="h-10 w-4/5 mx-auto bg-surface/50 rounded-xl animate-pulse" style={{ animationDelay: '200ms' }}></div>
              <div className="h-10 w-3/5 mx-auto bg-surface/40 rounded-xl animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>

            {/* Description */}
            <div className="space-y-2 w-full max-w-lg mb-8">
              <div className="h-4 w-full bg-surface/30 rounded-lg animate-pulse" style={{ animationDelay: '400ms' }}></div>
              <div className="h-4 w-4/5 mx-auto bg-surface/30 rounded-lg animate-pulse" style={{ animationDelay: '500ms' }}></div>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-glass-border w-full justify-center">
               <div className="w-11 h-11 rounded-full bg-surface/50 animate-pulse" style={{ animationDelay: '600ms' }}></div>
               <div className="space-y-2">
                 <div className="h-4 w-24 bg-surface/50 rounded animate-pulse" style={{ animationDelay: '700ms' }}></div>
                 <div className="h-3 w-32 bg-surface/30 rounded animate-pulse" style={{ animationDelay: '800ms' }}></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Image Skeleton */}
      <section className="container max-w-5xl mx-auto px-4 relative z-20 -mt-20 md:-mt-32 mb-16">
        <div className="relative w-full h-[40vh] md:h-[60vh] rounded-[2rem] bg-surface/40 animate-pulse border border-glass-border" style={{ animationDelay: '300ms' }}></div>
      </section>

      {/* Content Skeleton */}
      <section className="container max-w-2xl mx-auto px-6 mt-8">
        <div className="space-y-5">
          <div className="h-4 w-full bg-surface/40 rounded-lg animate-pulse" style={{ animationDelay: '500ms' }}></div>
          <div className="h-4 w-full bg-surface/35 rounded-lg animate-pulse" style={{ animationDelay: '600ms' }}></div>
          <div className="h-4 w-5/6 bg-surface/30 rounded-lg animate-pulse" style={{ animationDelay: '700ms' }}></div>
          <div className="h-20 w-full bg-surface/20 rounded-2xl animate-pulse border border-glass-border" style={{ animationDelay: '800ms' }}></div>
          <div className="h-4 w-full bg-surface/35 rounded-lg animate-pulse" style={{ animationDelay: '900ms' }}></div>
          <div className="h-4 w-4/6 bg-surface/30 rounded-lg animate-pulse" style={{ animationDelay: '1000ms' }}></div>
        </div>
      </section>
    </div>
  );
}
