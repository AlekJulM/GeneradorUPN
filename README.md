# Generador de Contraseñas Seguras

## 🔐 Descripción
Hemos desarrollado un generador de contraseñas seguras con base matemática que permite a los usuarios crear contraseñas robustas y personalizables. Nuestra herramienta combina la teoría de conjuntos y combinatoria para ofrecer un análisis detallado de la seguridad de las contraseñas generadas.

## ✨ Características

- **Personalización completa de caracteres**: Permite seleccionar qué tipos de caracteres incluir:
  - Minúsculas (a-z)
  - Mayúsculas (A-Z)
  - Números (0-9)
  - Símbolos especiales (!@#$%^&*()_+-=[]{}|;:'",.<>/?)
  
- **Longitud ajustable**: Contraseñas de 5 a 15 caracteres mediante un slider interactivo.

- **Análisis de seguridad en tiempo real**: Visualización del nivel de seguridad de la contraseña generada:
  - Débil: menos de 1 millón de combinaciones
  - Media: entre 1 millón y 1 billón de combinaciones
  - Fuerte: más de 1 billón de combinaciones

- **Diseño neumórfico**: Interfaz moderna con estilo neumórfico y experiencia de usuario intuitiva.

- **Base matemática sólida**: Implementa principios de teoría de conjuntos y combinatoria para calcular las posibilidades.

- **Copia con un clic**: Funcionalidad para copiar la contraseña al portapapeles con un solo clic.

## 🧮 Base Matemática

Nuestro generador se basa en principios matemáticos:

- **Teoría de Conjuntos**: Utilizamos 4 conjuntos distintos de caracteres:
  - M = Minúsculas (a-z): 26 caracteres
  - Ma = Mayúsculas (A-Z): 26 caracteres
  - N = Números (0-9): 10 caracteres
  - S = Símbolos especiales (!@#$...): 30 caracteres

- **Combinatoria**: Para calcular el número de posibles contraseñas, aplicamos la fórmula |C|^k, donde:
  - C es la unión de los conjuntos seleccionados (C = M ∪ Ma ∪ N ∪ S)
  - k es la longitud de la contraseña
  - |C|^k representa el número total de combinaciones posibles

## 🎨 Paleta de Colores

Implementamos una estética neumórfica utilizando la siguiente paleta de colores:
- Azul oscuro: #03045E
- Azul medio: #0077B6
- Azul claro: #00B4D8
- Azul más claro: #90E0EF
- Azul muy claro: #CAF0F8

## 💻 Tecnologías Utilizadas

- HTML5
- CSS3 (con diseño neumórfico)
- JavaScript (Vanilla JS, sin dependencias)

## 🌐 Compatibilidad

- Diseño responsive para dispositivos móviles y de escritorio
- Accesible según estándares ARIA
- Compatible con los principales navegadores modernos

## 📋 Instrucciones de Uso

1. Ajusta la longitud deseada mediante el slider
2. Selecciona qué tipos de caracteres deseas incluir (activa/desactiva las opciones)
3. Haz clic en "Generar Contraseña"
4. Visualiza el resultado y su nivel de seguridad
5. Usa el botón de copia para llevar la contraseña al portapapeles

## 🚀 Instalación

No requiere instalación. Simplemente:

```bash
# Clona el repositorio
git clone https://github.com/tuusuario/generador-contrasenas.git

# Navega al directorio
cd generador-contrasenas

# Abre el archivo index.html en tu navegador
```

## 👥 Equipo

Desarrollado como proyecto grupal por estudiantes apasionados por la seguridad informática y las matemáticas aplicadas.

## 📄 Licencia

[MIT](https://opensource.org/licenses/MIT)

---

⭐ ¡No dudes en dejar una estrella si te resulta útil! ⭐
