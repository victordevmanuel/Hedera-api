# Guía de Instalación y Ejecución del Proyecto

## Requisitos Previos

- Node.js (versión 21 o superior)
- npm (versión 6 o superior)
- Git

## Instalación

1. **Clonar el repositorio:**

    ```bash
    git clone https://gitlab.com/victor-manuel/api-node.git
    cd api-node
    ```

2. **Instalar dependencias:**

    ```bash
    npm install
    ```

## Ejecución

1. **Configurar variables de entorno:**

    Crea un archivo `.env` en la raíz del proyecto y añade las variables necesarias. Puedes usar el archivo `.env.example` como referencia.

2. **Correr las migraciones:**

    ```bash
    npm run bd:migrate
    ```

3. **Iniciar el servidor:**

    ```bash
    npm run dev
    ```

4. **Acceder a la API:**

    La API estará disponible en `http://localhost:4001`.

## Scripts Disponibles

- `npm start`: Inicia el servidor en modo producción.
- `npm run dev`: Inicia el servidor en modo desarrollo con recarga automática.

## Pruebas

Para ejecutar las pruebas, usa el siguiente comando:

```bash
npm test
```

