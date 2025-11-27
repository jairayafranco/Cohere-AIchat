export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    className = '',
    ariaLabel,
    ...props
}) {
    const baseClasses = 'px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 focus:ring-gray-500',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            aria-label={ariaLabel}
            {...props}
        >
            {children}
        </button>
    );
}
