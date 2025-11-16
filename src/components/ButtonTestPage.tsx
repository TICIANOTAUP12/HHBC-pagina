import React from 'react';
import { DarkBackgroundButton } from '../components/DarkBackgroundButton';
import { Button } from '../components/ui/button';

export function ButtonTestPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-white text-3xl mb-8">Prueba de Botones en Fondo Oscuro</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-white text-xl mb-4">DarkBackgroundButton Component</h2>
            <div className="flex gap-4">
              <DarkBackgroundButton>Botón Normal</DarkBackgroundButton>
              <DarkBackgroundButton disabled>Botón Deshabilitado</DarkBackgroundButton>
            </div>
          </div>
          
          <div>
            <h2 className="text-white text-xl mb-4">Button Regular (outline)</h2>
            <div className="flex gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                Botón Outline
              </Button>
              <Button variant="outline" disabled className="border-white/50 text-white/50">
                Botón Outline Deshabilitado
              </Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-white text-xl mb-4">Botones con diferentes tamaños</h2>
            <div className="flex gap-4 items-center">
              <DarkBackgroundButton size="sm">Pequeño</DarkBackgroundButton>
              <DarkBackgroundButton size="default">Normal</DarkBackgroundButton>
              <DarkBackgroundButton size="lg">Grande</DarkBackgroundButton>
            </div>
          </div>
          
          <div>
            <h2 className="text-white text-xl mb-4">Botones con iconos</h2>
            <div className="flex gap-4">
              <DarkBackgroundButton>
                <span className="mr-2">→</span>
                Con Icono
              </DarkBackgroundButton>
              <DarkBackgroundButton>
                Texto
                <span className="ml-2">←</span>
              </DarkBackgroundButton>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-gray-900 rounded-lg">
          <h3 className="text-white text-lg mb-4">Instrucciones de Prueba:</h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>• Pasa el mouse sobre los botones para ver el efecto hover</li>
            <li>• Haz clic en los botones para ver el efecto active</li>
            <li>• Navega con Tab para ver el efecto focus</li>
            <li>• El texto debe cambiar de blanco a negro en hover</li>
            <li>• El fondo debe cambiar de transparente a blanco en hover</li>
          </ul>
        </div>
      </div>
    </div>
  );
}