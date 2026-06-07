export default function Loading() {
  return (
    <div className="min-h-screen pt-32 pb-24 flex justify-center items-start">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col gap-12 animate-pulse">
        
        {/* Hero Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-16 pt-8">
          <div className="flex-1 w-full space-y-6">
            <div className="h-8 w-32 bg-surface/80 rounded-full"></div>
            <div className="h-16 w-3/4 bg-surface/80 rounded-xl"></div>
            <div className="h-24 w-full bg-surface/80 rounded-xl"></div>
          </div>
          <div className="flex-1 w-full h-[60vh] bg-surface/80 rounded-[2rem]"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={`bg-surface/80 rounded-3xl ${i === 1 ? 'md:col-span-2 md:row-span-2 h-[500px]' : 'h-[300px]'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
