import React from 'react';
import { ImageWithFallback } from './ImageWithFallback';

interface ServiceImageProps {
  src: string;
  alt: string;
  className?: string;
  variant?: 'default' | 'transparent' | 'rounded';
  size?: 'small' | 'medium' | 'large' | 'full';
}

export function ServiceImage({ 
  src, 
  alt, 
  className = '', 
  variant = 'default',
  size = 'medium'
}: ServiceImageProps) {
  // Tamaños predefinidos para que coincida con el grupo de contenedores
  const sizeClasses = {
    small: 'w-48 h-48',
    medium: 'w-96 h-96',
    large: 'w-full h-[500px]',
    full: 'w-full h-full'
  };

  // Estilos según la variante
  const variantClasses = {
    default: 'object-cover shadow-lg',
    transparent: 'object-contain bg-transparent',
    rounded: 'object-cover rounded-lg shadow-xl'
  };

  // Combinar clases
  const combinedClasses = `${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <ImageWithFallback
        src={src}
        alt={alt}
        className={combinedClasses}
      />
    </div>
  );
}

// Imágenes de servicios sin fondo (descargadas localmente)
export const serviceImages = {
  legal: {
    transparent: "/src/assets/legal-consultant-transparent.png",
    fallback: "https://images.unsplash.com/photo-1589307904488-7d60ff29c975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGxhdyUyMG9mZmljZXxlbnwxfHx8fDE3NjIyMzU5OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  it: {
    transparent: "/src/assets/it-consultant-transparent.png", 
    fallback: "https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwdGVhbXxlbnwxfHx8fDE3NjIzMDEwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  accounting: {
    transparent: "/src/assets/accounting-consultant-transparent.png",
    fallback: "https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBhZHZpc29yJTIwZGVza3xlbnwxfHx8fDE3NjIzMDEwOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
};