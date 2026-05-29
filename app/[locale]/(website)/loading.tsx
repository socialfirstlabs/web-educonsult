export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-jn-bg-off to-jn-primary-light pb-24 pt-12">
        <div className="jn-container text-center">
          <div className="h-6 w-36 bg-jn-border/60 rounded-full mx-auto mb-6" />
          <div className="h-12 w-2/3 bg-jn-border/60 rounded-2xl mx-auto mb-4" />
          <div className="h-12 w-1/2 bg-jn-border/60 rounded-2xl mx-auto mb-6" />
          <div className="h-5 w-3/4 bg-jn-border/40 rounded-xl mx-auto mb-2" />
          <div className="h-5 w-2/3 bg-jn-border/40 rounded-xl mx-auto mb-9" />
          <div className="flex gap-4 justify-center">
            <div className="h-12 w-44 bg-jn-primary/25 rounded-full" />
            <div className="h-12 w-36 bg-jn-border/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="jn-section bg-white">
        <div className="jn-container">
          <div className="h-6 w-24 bg-jn-border/50 rounded-full mx-auto mb-4" />
          <div className="h-9 w-72 bg-jn-border/60 rounded-xl mx-auto mb-4" />
          <div className="h-5 w-96 bg-jn-border/40 rounded-xl mx-auto mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-jn-bg-off rounded-2xl border border-jn-border overflow-hidden"
              >
                <div className="h-36 bg-jn-border/40" />
                <div className="p-7 space-y-3">
                  <div className="h-4 w-20 bg-jn-border/60 rounded" />
                  <div className="h-6 w-40 bg-jn-border/60 rounded" />
                  <div className="h-4 w-full bg-jn-border/40 rounded" />
                  <div className="h-4 w-5/6 bg-jn-border/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
