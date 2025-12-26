import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';
import { Plus } from 'lucide-react';

export function PageContainer({ 
  children, 
  className, 
  title, 
  icon: Icon,
  buttonText,
  onButtonClick,
  ...props 
}) {
  const { theme } = useTheme();

  return (
    <div 
      className="min-h-screen flex-1"
      style={{ 
        background: `${theme.background} !important`, 
        backgroundImage: 'none !important',
        backgroundAttachment: 'initial !important',
        backgroundClip: 'initial !important',
        backgroundOrigin: 'initial !important',
        backgroundPosition: 'initial !important',
        backgroundRepeat: 'no-repeat !important',
        backgroundSize: 'initial !important'
      }}
    >
      <div className="flex flex-col h-full bg-solid" 
      style={{ 
        background: `${theme.background} !important`, 
        backgroundImage: 'none !important',
        backgroundAttachment: 'initial !important',
        backgroundClip: 'initial !important',
        backgroundOrigin: 'initial !important',
        backgroundPosition: 'initial !important',
        backgroundRepeat: 'no-repeat !important',
        backgroundSize: 'initial !important'
      }}>
        
        {/* Navbar */}
        <div 
          className="h-20 shadow flex items-center justify-between px-6 sticky top-0 z-10"
          style={{ 
            background: theme.primary,
            color: theme.textOnPrimary
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {Icon && <Icon size={28} />}
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
          </div>

          {buttonText && onButtonClick && (
            <button 
              onClick={onButtonClick}
              className="flex items-center gap-3 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              style={{ 
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: theme.textOnPrimary
              }}
            >
              <Plus size={18} />
              {buttonText}
            </button>
          )}
        </div>

        {/* Conteúdo principal */}
        <main 
          className={cn('p-6 flex-1 w-full', className)}
          style={{ color: theme.textPrimary, background: theme.background, backgroundImage: 'none' }}
          {...props}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}