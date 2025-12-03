# 🚀 Guía de Inicio Rápido: Drag & Drop

## ✅ Estado Actual

**Frontend**: ✅ Completamente implementado y compilado exitosamente  
**Backend**: ⏳ Pendiente de implementación

## 🎯 Para Empezar a Usar

### 1. Inicia el Servidor de Desarrollo

```bash
cd "/home/alessandro-hp/Documentos/IngSoftAvanzada/Modelo de Aplicación Restaurante (1)"
npm run dev
```

### 2. Accede al Panel de Administración

1. Abre tu navegador en `http://localhost:5173`
2. Inicia sesión como administrador
3. Ve a la pestaña **"Mi Menú"**
4. Busca las categorías con platillos

### 3. Prueba el Drag & Drop

1. **Ubica el icono**: Busca el ícono de líneas verticales `⋮⋮` a la izquierda de cada platillo
2. **Haz clic**: Mantén presionado el botón del mouse sobre el ícono
3. **Arrastra**: Mueve el platillo hacia arriba o abajo
4. **Suelta**: Suelta el botón en la nueva posición
5. **Confirma**: El orden debería cambiar instantáneamente

## ⚠️ Importante: Implementación del Backend

Para que los cambios se guarden permanentemente, debes implementar el endpoint en el backend:

### Endpoint Requerido

```python
# En tu archivo de rutas del backend (ej: admin_routes.py)

@router.put("/categorias/{categoria_id}/reordenar-items")
async def reordenar_items_categoria(
    categoria_id: str,
    body: dict,
    current_user: dict = Depends(get_current_admin)
):
    """
    Actualiza el orden de los items en una categoría.
    
    Args:
        categoria_id: ID de la categoría
        body: {"items": ["nombre_item_1", "nombre_item_2", ...]}
    
    Returns:
        {"status": "success", "message": "Orden actualizado"}
    """
    try:
        items_nombres = body.get("items", [])
        
        # 1. Buscar la categoría
        categoria = await db.categorias.find_one({"_id": ObjectId(categoria_id)})
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        # 2. Validar que todos los items existen
        items_actuales = {item["nombre"]: item for item in categoria.get("items", [])}
        
        # 3. Crear nueva lista ordenada
        items_ordenados = []
        for nombre in items_nombres:
            if nombre in items_actuales:
                items_ordenados.append(items_actuales[nombre])
        
        # 4. Actualizar en la base de datos
        await db.categorias.update_one(
            {"_id": ObjectId(categoria_id)},
            {"$set": {"items": items_ordenados}}
        )
        
        return {
            "status": "success",
            "message": "Orden de items actualizado correctamente"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Ejemplo de Petición

**Request:**
```http
PUT /api/admin/categorias/507f1f77bcf86cd799439011/reordenar-items
Authorization: Bearer <tu-token-jwt>
Content-Type: application/json

{
  "items": [
    "Longaniza",
    "Barbacoa de Res",
    "Barbacoa a la Mexicana",
    "Carne Asada o Enchipotlada",
    "Milanesa de Res"
  ]
}
```

**Response (Exitosa):**
```json
{
  "status": "success",
  "message": "Orden de items actualizado correctamente"
}
```

**Response (Error):**
```json
{
  "detail": "Categoría no encontrada"
}
```

## 📋 Checklist de Implementación Backend

```
[ ] Agregar ruta PUT /categorias/{id}/reordenar-items
[ ] Validar que el usuario sea administrador
[ ] Validar que la categoría existe
[ ] Validar que todos los items en el array existen
[ ] Actualizar el orden en la base de datos
[ ] Retornar respuesta exitosa
[ ] Manejar errores apropiadamente
[ ] Probar el endpoint con Postman/Thunder Client
[ ] Integrar con el frontend
[ ] Verificar que los cambios persisten
```

## 🧪 Testing

### Test Manual Rápido

1. **Antes de implementar el backend:**
   - Arrastra un platillo
   - Verifica que cambia visualmente
   - Recarga la página
   - El platillo volverá a su posición original ❌

2. **Después de implementar el backend:**
   - Arrastra un platillo
   - Verifica que cambia visualmente
   - Recarga la página
   - El platillo permanece en la nueva posición ✅

### Test con Consola del Navegador

Abre las herramientas de desarrollo (F12) y ve a la pestaña "Network":

1. Arrastra un platillo
2. Busca la petición PUT a `/reordenar-items`
3. Verifica que:
   - Status: 200 OK ✅
   - Body contiene el array de items en el nuevo orden
   - Response es exitosa

## 📱 Características Implementadas

### ✅ En el Frontend

- [x] Librería @dnd-kit instalada
- [x] Componente SortableItem creado
- [x] DndContext configurado
- [x] Sensores (mouse y teclado) configurados
- [x] Handle de arrastre visible (⋮⋮)
- [x] Estados visuales (hover, dragging)
- [x] Actualización optimista de UI
- [x] Petición al backend
- [x] Compatible con touch
- [x] Transiciones suaves
- [x] Compilación exitosa

### ⏳ Pendiente en el Backend

- [ ] Endpoint `/reordenar-items` implementado
- [ ] Validaciones de seguridad
- [ ] Persistencia en base de datos
- [ ] Manejo de errores

## 🎨 Apariencia Visual

### Icono de Arrastre
```
⋮⋮  ← Este icono aparece antes de cada platillo
```

### Colores Usados
- **Handle normal**: Naranja semi-transparente (#f97316, 50% opacidad)
- **Handle hover**: Naranja completo (#f97316, 100% opacidad)
- **Item arrastrando**: Opacidad 50%
- **Borde hover**: Naranja más intenso (#fb923c)

## 🔍 Solución de Problemas

### Problema: No veo el icono ⋮⋮
**Solución**: Recarga la página con Ctrl+F5 (limpia caché)

### Problema: No puedo arrastrar
**Solución**: 
1. Asegúrate de hacer clic exactamente en el icono ⋮⋮
2. Mantén presionado el botón del mouse
3. Mueve el cursor mientras mantienes presionado

### Problema: El orden no se guarda
**Solución**: Implementa el endpoint del backend (ver arriba)

### Problema: Error 401 al arrastrar
**Solución**: 
1. Tu sesión expiró
2. Vuelve a iniciar sesión
3. Intenta nuevamente

## 📚 Documentación Adicional

- [Guía completa de uso](./DRAG_AND_DROP_FEATURE.md)
- [Resumen de implementación](./RESUMEN_DRAG_DROP.md)
- [Demo visual](./DEMO_VISUAL_DRAG_DROP.md)

## 🎯 Próximos Pasos

1. **Implementar el backend** (prioridad alta)
2. **Probar en diferentes navegadores**
3. **Probar en dispositivos móviles**
4. **Agregar indicador de carga** (opcional)
5. **Implementar deshacer/rehacer** (opcional)

## 💬 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que el backend esté corriendo
3. Consulta esta documentación
4. Contacta al equipo de desarrollo

---

**🎉 ¡Felicidades!** Has implementado exitosamente el drag & drop en el frontend.  
**📌 Recuerda**: Implementa el backend para que los cambios persistan.

**Última actualización**: 2 de diciembre de 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Frontend listo | ⏳ Backend pendiente
