#!/usr/bin/env python3
"""
Script para generar imágenes sin fondo para los servicios de HHBC Consultancy
"""
import requests
import os

# URLs de imágenes con fondo blanco (sin fondo)
service_images = {
    'legal': {
        'url': 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20business%20lawyer%20consultant%2C%20formal%20attire%2C%20holding%20documents%2C%20white%20background%2C%20corporate%20style%2C%20clean%20professional%20lighting%2C%20high%20quality%2C%20business%20portrait&image_size=portrait_4_3',
        'filename': 'legal-consultant-transparent.png',
        'description': 'Consultor legal profesional'
    },
    'it': {
        'url': 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20IT%20consultant%2C%20with%20laptop%2C%20modern%20business%20attire%2C%20white%20background%2C%20corporate%20technology%20style%2C%20clean%20professional%20lighting%2C%20high%20quality%20business%20portrait&image_size=portrait_4_3',
        'filename': 'it-consultant-transparent.png',
        'description': 'Consultor IT profesional'
    },
    'accounting': {
        'url': 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20accountant%20consultant%2C%20with%20financial%20documents%2C%20calculator%2C%20business%20attire%2C%20white%20background%2C%20corporate%20finance%20style%2C%20clean%20professional%20lighting%2C%20high%20quality%20business%20portrait&image_size=portrait_4_3',
        'filename': 'accounting-consultant-transparent.png',
        'description': 'Consultor contable profesional'
    }
}

def download_image(url, filename, description):
    """Descargar imagen desde URL"""
    try:
        print(f"Descargando {description}...")
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Crear directorio si no existe
        assets_dir = 'src/assets'
        os.makedirs(assets_dir, exist_ok=True)
        
        # Guardar imagen
        filepath = os.path.join(assets_dir, filename)
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ {description} descargada: {filepath}")
        return filepath
        
    except Exception as e:
        print(f"❌ Error descargando {description}: {str(e)}")
        return None

def main():
    """Función principal"""
    print("🎨 Generando imágenes sin fondo para HHBC Consultancy...")
    print("=" * 60)
    
    downloaded_images = []
    
    for service, data in service_images.items():
        print(f"\nProcesando servicio: {service.upper()}")
        filepath = download_image(data['url'], data['filename'], data['description'])
        if filepath:
            downloaded_images.append(filepath)
    
    print("\n" + "=" * 60)
    if downloaded_images:
        print(f"✅ Imágenes descargadas exitosamente:")
        for img in downloaded_images:
            print(f"   - {img}")
        print(f"💡 Para usar estas imágenes:")
        print(f"   1. Actualiza el componente ServiceImage")
        print(f"   2. Cambia 'transparent' a 'rounded' para bordes redondeados")
        print(f"   3. Ajusta el tamaño con size='medium' o 'large'")
    else:
        print("❌ No se pudieron descargar las imágenes")
        print("💡 Usa las URLs directamente o descarga manualmente")

if __name__ == "__main__":
    main()