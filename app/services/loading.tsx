export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Navigation Bar Skeleton */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/20 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="h-16 w-96 bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-full max-w-3xl bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-700 rounded mx-auto mb-8 animate-pulse"></div>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections Skeleton */}
      {[1, 2, 3, 4].map((section) => (
        <section
          key={section}
          className={`py-20 px-4 sm:px-6 lg:px-8 ${section % 2 === 0 ? "bg-gray-900" : ""}`}
          style={section % 2 === 1 ? { backgroundColor: "#1E1E1E" } : {}}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={section % 2 === 0 ? "order-2 lg:order-1" : ""}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-700 rounded animate-pulse mr-4"></div>
                  <div className="h-10 w-48 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="h-6 w-full bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-5/6 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-4/5 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-24 bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-12 w-40 bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className={section % 2 === 0 ? "order-1 lg:order-2" : ""}>
                <div className="h-80 bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Support Section Skeleton */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#1E1E1E" }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-10 w-96 bg-gray-700 rounded mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 w-2/3 bg-gray-700 rounded mx-auto mb-12 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-48 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 w-40 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-12 w-40 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
