import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    alt = '',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/envelope/seal.webp"
            alt={alt}
            className={cn('rounded-full object-cover', className)}
            draggable={false}
            {...props}
        />
    );
}
