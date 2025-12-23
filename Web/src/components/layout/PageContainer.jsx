import { cn } from '@/lib/utils';

export function PageContainer({ children, className, title, ...props }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Espaço para sidebar */}
      <div className="ml-20 transition-all duration-300">
        {/* Header da página */}
        {title && (
          <div className="bg-white shadow-sm border-b px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          </div>
        )}
        
        {/* Conteúdo principal */}
        <main 
          className={cn('p-6', className)} 
          {...props}
        >
          {children}
        </main>
      </div>
    </div>
  );
}