export default function Loading() {
  return (
    <div className="min-h-screen relative pb-32 animate-pulse">
      {/* Header Skeleton */}
      <section className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center bg-surface/50">
        <div className="relative z-10 container max-w-4xl mx-auto px-4 mt-20">
          <div className="bg-surface/30 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center">
            <div className="h-4 w-32 bg-surface/80 rounded-full mb-6"></div>
            <div className="h-16 w-3/4 bg-surface/80 rounded-xl mb-8"></div>
            <div className="flex items-center gap-4 pt-6 border-t border-glass-border w-full justify-center">
               <div className="w-10 h-10 rounded-full bg-surface/80"></div>
               <div className="h-4 w-20 bg-surface/80 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Image Skeleton */}
      <section className="container max-w-5xl mx-auto px-4 relative z-20 -mt-20 md:-mt-32 mb-16">
        <div className="relative w-full h-[40vh] md:h-[60vh] rounded-[2rem] bg-surface/80"></div>
      </section>

      {/* Content Skeleton */}
      <section className="container max-w-2xl mx-auto px-6 mt-8">
        <div className="space-y-4">
          <div className="h-4 w-full bg-surface/50 rounded"></div>
          <div className="h-4 w-full bg-surface/50 rounded"></div>
          <div className="h-4 w-5/6 bg-surface/50 rounded"></div>
          <div className="h-4 w-full bg-surface/50 rounded"></div>
          <div className="h-4 w-4/6 bg-surface/50 rounded"></div>
        </div>
      </section>
    </div>
  );
}
