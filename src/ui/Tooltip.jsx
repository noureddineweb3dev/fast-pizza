import { useState } from 'react';

function Tooltip({ children, text, position = 'top' }) {
    const [visible, setVisible] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div className={`absolute ${positions[position]} z-50 px-3 py-2 text-xs font-medium text-white bg-zinc-800 border border-white/10 rounded-lg shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150`}>
                    {text}
                    <div className={`absolute w-2 h-2 bg-zinc-800 border-white/10 rotate-45 ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b' :
                            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t' :
                                position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r' :
                                    'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'
                        }`} />
                </div>
            )}
        </div>
    );
}

export default Tooltip;
