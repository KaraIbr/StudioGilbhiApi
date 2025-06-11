# Ghibli Explorer

Una plataforma web minimalista para explorar películas y personajes de Studio Ghibli, con favoritos, inicio de sesión y registro. Hecho solo con **HTML5, CSS3 y JavaScript puro**, sin frameworks ni backend, usando **LocalStorage** y **SessionStorage** para gestión de usuarios y datos.

---

## Estructura de Carpetas

```
/ghibli-app/
  /login/       # Inicio de sesión
  /register/    # Registro de usuarios
  /catalogo/    # Catálogo principal de películas y personajes
  /detalles/    # Vista de detalles de cada elemento
  /favorites/   # Lista de favoritos del usuario
  /assets/      # Imágenes o recursos estáticos (opcional)
  README.md
```

---

## ¿Qué incluye cada carpeta?

- **/login/**: Formulario de inicio de sesión. Valida contra los usuarios registrados en LocalStorage.
- **/register/**: Registro de nuevos usuarios. Guarda usuarios y contraseñas (sin cifrar, solo para pruebas educativas).
- **/catalogo/**: Vista principal. Permite explorar películas y personajes consumiendo la [Studio Ghibli API](https://ghibliapi.vercel.app/). Permite agregar/quitar favoritos.
- **/detalles/**: Muestra información extendida y permite marcar/desmarcar como favorito.
- **/favorites/**: Visualiza y administra los favoritos (películas/personajes) del usuario actual.
- **/assets/**: Para imágenes de portada, avatares, logotipo, etc (puedes agregar lo que necesites).

---

## Lógica de almacenamiento

- **Usuarios y favoritos** se guardan en `localStorage` bajo la clave `ghibli_users` como un array de objetos:
    ```js
    [
      {
        username: "usuario",
        password: "contraseña",
        favorites: {
          films: ["id1", "id2"],
          people: ["id3"]
        }
      }
    ]
    ```
- **Usuario activo** se guarda en `sessionStorage` bajo la clave `ghibli_session`.

---

## Flujo de navegación

1. **/login/Login.html**
2. **/register/Register.html**
3. **/catalogo/Catalogo.html** (solo si hay sesión activa)
4. **/detalles/Detalles.html?id=...&type=...**
5. **/favorites/Favorites.html**

---

## Tecnologías y stack

- **HTML5**: Estructura de cada página.
- **CSS3**: Estilo pastel, minimalista, con animaciones suaves y Flexbox.
- **JavaScript puro**: Manejo de lógica, UI, consumo de API y almacenamiento.
- **Studio Ghibli API**: https://ghibliapi.vercel.app/

---

## Instalación y uso

1. **Descarga o clona el repositorio.**
2. Abre `login/Login.html` o `register/Register.html` en tu navegador.
3. Navega entre las páginas usando los enlaces de la interfaz.
4. El almacenamiento y favoritos son **locales por navegador**.

---

## Consideraciones

- **No hay backend**. Todo el manejo de usuarios y favoritos es solo en el navegador.
- **Las contraseñas NO están cifradas** (proyecto educativo).
- **No hay recuperación de contraseña ni emails**.
- **Cada usuario solo ve y modifica sus propios favoritos**.

---

## Créditos

- Inspirado en el arte y películas de [Studio Ghibli](https://www.ghibli.jp/).
- API de datos: [Studio Ghibli API](https://ghibliapi.vercel.app/)
- Creado por KaraIbr

---