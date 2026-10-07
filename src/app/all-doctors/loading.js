export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Trusted Doctors</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse">
              
              {/* Image Skeleton */}
              <div className="h-48 bg-gray-200 border-b border-gray-100"></div>

              <div className="p-5 flex flex-col flex-grow">
                {/* Available Status Skeleton */}
                <div className="h-4 w-20 bg-gray-200 rounded-full mb-3"></div>
                
                {/* Name Skeleton */}
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                
                {/* Speciality Skeleton */}
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-5"></div>
                
                <div className="mt-auto space-y-3 mb-5">
                  {/* Experience Skeleton */}
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  {/* Location Skeleton */}
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>

                {/* Button Skeleton */}
                <div className="w-full h-11 rounded-lg bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
