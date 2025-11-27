export default function LoadingSpinner({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-3',
    };

    return (
        <div
            className={`animate-spin rounded-full border-green-500 border-t-transparent ${sizeClasses[size]} ${className}`}
            role="status"
            aria-label="Cargando"
        >
            <span className="sr-only">Cargando...</span>
        </div>
    );
}
