# Solucionador de 15-Puzzle (Algoritmo IDA*)

Esta es una aplicación web interactiva que genera, desordena y resuelve automáticamente el clásico juego del 15-Puzzle. La aplicación permite elegir entre diferentes configuraciones meta (horizontal, vertical, serpiente, espiral, etc.) y muestra paso a paso la solución óptima utilizando inteligencia artificial.

##  Requerimientos Técnicos

El proyecto fue desarrollado bajo la filosofía "Vanilla" (sin dependencias externas), lo que garantiza una ejecución rápida, ligera y sin necesidad de configuraciones complejas en el servidor.

*   **Lenguajes utilizados:** HTML5, CSS3 y JavaScript (ES6+).
*   **Librerías o Frameworks:** Ninguno. La lógica, animaciones y renderizado se manejan de forma nativa con JavaScript puro (Vanilla JS).
*   **Servicios de terceros:** Ninguno. Todo el procesamiento se realiza del lado del cliente (en el navegador), por lo que no requiere conexión a internet ni consumo de APIs externas.
*   **Entorno compatible:** Cualquier navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).

##  Cómo ejecutar la aplicación

Al ser una aplicación web estática, no se requiere la instalación de Node.js, Python, Apache ni ningún otro servidor local.

1. Descarga o clona la carpeta del proyecto.
2. Asegúrate de tener los tres archivos en el mismo directorio:
   * `index.html`
   * `style.css`
   * `script.js`
3. Haz doble clic sobre el archivo `index.html`.
4. El archivo se abrirá automáticamente en tu navegador web predeterminado y estará listo para usarse.

##  Datos de Entrada

La aplicación es completamente interactiva. Los datos que el usuario ingresa o selecciona son:

1.  **Selección de la Meta (Target):** Mediante un menú desplegable (`<select>`), el usuario elige el estado final deseado. Las opciones disponibles son:
    *   Horizontal
    *   Vertical
    *   Serpiente
    *   Espiral o Caracol
    *   Diagonal
    *   Retroceso horizontal
2.  **Desordenamiento (Mezclar):** Al presionar el botón "Mezclar", el sistema ejecuta internamente una secuencia de 30 movimientos aleatorios **válidos** a partir de la meta actual. *Nota: Se usa este método en lugar de generación aleatoria pura para garantizar matemáticamente que el tablero resultante siempre tenga solución.*
3.  **Ejecución (Resolver Automáticamente):** El botón que dispara el algoritmo de búsqueda para encontrar la ruta óptima desde el estado desordenado hasta la meta.

##  Datos de Salida

Una vez que el algoritmo procesa el tablero, el sistema devuelve las siguientes salidas:

1.  **Animación Visual:** El tablero actualiza la posición de las fichas en la interfaz gráfica, mostrando la transición del espacio vacío (0) y las piezas de colores.
2.  **Registro de Pasos (Log):** En el panel lateral derecho se imprime una lista detallada de los movimientos realizados.
    *   *Formato de salida:* `Paso [N]: Ficha [X] se movió [Dirección]` (Ej. *Paso 1: Ficha 12 se movió hacia Abajo*).
3.  **Contador Total:** Un indicador numérico que muestra la cantidad exacta de pasos (movimientos) que tomó llegar a la solución óptima.

##  Lógica y Algoritmo Utilizado

Para la resolución de este problema se implementó el algoritmo de búsqueda **IDA*** (Iterative Deepening A* / Búsqueda A* de Profundidad Iterativa). 

Se eligió IDA* sobre A* tradicional para optimizar el uso de la memoria RAM del navegador, ya que A* puro guarda todos los nodos explorados, lo que puede congelar la pestaña.

*   **Heurística empleada:** **Distancia de Manhattan**. El algoritmo calcula la distancia absoluta (en filas y columnas) que le falta a cada ficha para llegar a su posición meta. Esta heurística es *admisible*, lo que garantiza que la ruta encontrada será siempre la más corta posible.
