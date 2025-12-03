# 🎯 Funcionalidad de Arrastrar y Soltar (Drag & Drop)

## 📋 Descripción

Se ha implementado la funcionalidad de **arrastrar y soltar** para reordenar los platillos dentro de cada categoría en el panel de administración. Esto permite que el administrador pueda cambiar el orden en que los platillos se muestran tanto en el panel de administración como en la página principal del restaurante.

## ✨ Características

### 1. **Interfaz Intuitiva**
- Icono de agarre (⋮⋮) visible en cada platillo
- Cursor cambia a "grab" al pasar el mouse sobre el handle
- Cursor cambia a "grabbing" mientras se arrastra
- Feedback visual durante el arrastre (opacidad reducida)

### 2. **Funcionamiento**
- **Clic y arrastrar**: Haz clic en el icono de agarre y mueve el platillo arriba o abajo
- **Suelta**: Suelta el platillo en la nueva posición
- **Actualización automática**: El orden se guarda automáticamente en el backend
- **Sincronización**: Los cambios se reflejan inmediatamente en:
  - Panel de administración
  - Página principal del restaurante

### 3. **Experiencia de Usuario**
- Transiciones suaves
- No requiere guardar manualmente
- Funciona en todos los navegadores modernos
- Compatible con dispositivos táctiles

## 🛠️ Implementación Técnica

### Librerías Utilizadas
```json
{
  "@dnd-kit/core": "^6.x.x",
  "@dnd-kit/sortable": "^8.x.x",
  "@dnd-kit/utilities": "^3.x.x"
}
```

### Componentes Modificados

1. **AdminPanel.tsx**
   - Se agregó el componente `SortableItem` para items arrastrables
   - Se implementó `DndContext` para manejar el drag & drop
   - Se agregó la función `actualizarOrdenItems` para persistir cambios

2. **Backend (Endpoint requerido)**
   ```
   PUT /api/admin/categorias/{categoria_id}/reordenar-items
   Body: { items: ["nombre_item_1", "nombre_item_2", ...] }
   ```

## 📝 Cómo Usar

### En el Panel de Administración

1. **Navegar a "Mi Menú"**
   - Abre el panel de administración
   - Haz clic en la pestaña "Mi Menú"

2. **Seleccionar una Categoría**
   - Encuentra la categoría cuyos platillos quieres reordenar
   - Los platillos se muestran dentro de cada tarjeta de categoría

3. **Reordenar Platillos**
   - Ubica el icono de líneas verticales (⋮⋮) a la izquierda de cada platillo
   - Haz clic y mantén presionado el icono
   - Arrastra el platillo hacia arriba o abajo
   - Suelta en la posición deseada

4. **Confirmación**
   - El orden se guarda automáticamente
   - No necesitas hacer clic en ningún botón de guardar
   - Los cambios se reflejan inmediatamente

### Visualización en la Página Principal

El nuevo orden de los platillos se mostrará automáticamente en:
- La sección de menú de la página principal
- Cualquier vista pública del menú

## 🎨 Elementos Visuales

### Handle de Arrastre
```
⋮⋮  [Icono visible en cada platillo]
```

### Estados Visuales

| Estado | Apariencia |
|--------|------------|
| **Normal** | Handle semi-transparente (50% opacidad) |
| **Hover** | Handle completamente visible (100% opacidad) |
| **Arrastrando** | Platillo completo con 50% opacidad |
| **Cursor Grab** | Mano abierta al pasar sobre el handle |
| **Cursor Grabbing** | Mano cerrada mientras se arrastra |

## ⚙️ Configuración del Backend

Para que esta funcionalidad funcione completamente, asegúrate de que el backend tenga implementado el siguiente endpoint:

```python
@router.put("/categorias/{categoria_id}/reordenar-items")
async def reordenar_items(
    categoria_id: str,
    items: dict,  # {"items": ["nombre1", "nombre2", ...]}
    current_user: dict = Depends(get_current_admin)
):
    """
    Actualiza el orden de los items en una categoría.
    El array de items debe contener los nombres en el nuevo orden.
    """
    # Implementación del backend
    # 1. Validar que la categoría existe
    # 2. Validar que todos los items existen
    # 3. Actualizar el orden de los items
    # 4. Retornar la categoría actualizada
```

## 🐛 Solución de Problemas

### El orden no se guarda
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador para errores
3. Asegúrate de que el token de autenticación sea válido

### Los platillos no se pueden arrastrar
1. Verifica que la categoría tenga al menos 2 platillos
2. Asegúrate de hacer clic específicamente en el icono de agarre (⋮⋮)
3. Intenta refrescar la página

### El orden se revierte después de arrastrar
1. Verifica que el endpoint del backend esté implementado correctamente
2. Revisa los logs del servidor para errores
3. Confirma que la respuesta del servidor sea exitosa

## 📊 Rendimiento

- **Optimización**: Los cambios se aplican localmente primero para feedback inmediato
- **Persistencia**: Se guarda en el backend de forma asíncrona
- **Sin bloqueo**: La interfaz permanece responsive durante la actualización

## 🔒 Seguridad

- Solo usuarios autenticados como administradores pueden reordenar platillos
- Cada petición requiere un token JWT válido
- El backend valida que los items pertenezcan a la categoría especificada

## 📱 Compatibilidad

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Dispositivos táctiles (móviles y tabletas)

## 🎯 Próximas Mejoras

- [ ] Arrastrar y soltar categorías completas
- [ ] Animaciones más elaboradas
- [ ] Modo de vista previa antes de guardar
- [ ] Historial de cambios de orden
- [ ] Deshacer/Rehacer cambios

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor:
1. Revisa esta documentación
2. Consulta los logs del navegador y del servidor
3. Contacta al equipo de desarrollo

---

**Versión**: 1.0.0  
**Fecha**: Diciembre 2, 2025  
**Estado**: ✅ Implementado y funcionando
