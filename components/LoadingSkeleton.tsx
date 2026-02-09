/**
 * Componentes de Loading Skeleton reutilizáveis
 * Para uso em lazy loading e carregamento de dados
 */

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

export function PostSkeleton() {
  return (
    <article className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>
    </article>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-14 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 animate-pulse">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-10 bg-gray-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Skeleton */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-6" />
          <div className="h-10 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <FormSkeleton />
      </div>
    </div>
  );
}

export default {
  Card: CardSkeleton,
  Post: PostSkeleton,
  Form: FormSkeleton,
  Table: TableSkeleton,
  Page: PageSkeleton,
};

