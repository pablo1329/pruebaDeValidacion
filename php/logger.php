<?php
/**
 * Clase Logger - Gestiona el registro de errores en archivo
 * Almacena errores tanto en memoria como en archivo de log
 */
class Logger {
    
    // Ruta del archivo de log
    private static string $rutaLog = __DIR__ . '/../logs/errores.log';
    
    // Array para almacenar errores en memoria durante la sesión
    private static array $errores = [];
    
    /**
     * Registra un error en archivo y en memoria
     * @param string $mensaje Mensaje del error
     * @param string $contexto Contexto del error (ej: "MYSQLI_DESTRUCTOR_ERROR")
     * @param string $tipo Tipo de error (ERROR, WARNING, INFO, DEBUG)
     * @return void
     */
    public static function registrarError(string $mensaje, string $contexto = '', string $tipo = 'ERROR'): void {
        
        // Crear carpeta logs si no existe
        self::crearCarpetaLogsSiNoExiste();
        
        // Almacenar en memoria
        self::$errores[] = [
            'timestamp' => date('Y-m-d H:i:s'),
            'tipo' => $tipo,
            'mensaje' => $mensaje,
            'contexto' => $contexto
        ];
        
        // Escribir en archivo
        self::escribirEnArchivo($mensaje, $contexto, $tipo);
    }
    
    /**
     * Escribe el error en el archivo de log
     * @param string $mensaje Mensaje del error
     * @param string $contexto Contexto del error
     * @param string $tipo Tipo de error
     * @return void
     */
    private static function escribirEnArchivo(string $mensaje, string $contexto, string $tipo): void {
        
        // Formatea la línea de log
        $timestamp = date('Y-m-d H:i:s');
        $linea = "[$timestamp] [$tipo] [$contexto] $mensaje\n";
        
        // Agregar línea al archivo (FILE_APPEND = no sobrescribir)
        file_put_contents(self::$rutaLog, $linea, FILE_APPEND);
    }
    
    /**
     * Crea la carpeta logs si no existe
     * @return void
     */
    private static function crearCarpetaLogsSiNoExiste(): void {
        
        // Obtener la carpeta del archivo de log
        $carpeta = dirname(self::$rutaLog);
        
        // Si no existe, crearla
        if (!is_dir($carpeta)) {
            mkdir($carpeta, 0755, true);
        }
    }
    
    /**
     * Obtiene el último error registrado
     * @return array|null Array con el error o null si no hay
     */
    public static function obtenerUltimo(): ?array {
        
        // end() devuelve el último elemento del array
        $ultimoError = end(self::$errores);
        
        // Si el array está vacío, end() devuelve false, lo convertimos a null
        return $ultimoError ?: null;
    }
    
    /**
     * Obtiene los últimos N errores registrados
     * @param int $cantidad Cantidad de errores a obtener
     * @return array Array con los errores
     */
    public static function obtenerUltimos(int $cantidad = 10): array {
        
        // Si no existe el archivo, devolver array vacío
        if (!file_exists(self::$rutaLog)) {
            return [];
        }
        
        // Leer todas las líneas del archivo
        $lineas = file(self::$rutaLog);
        
        // Obtener solo las últimas N líneas
        // array_slice($array, $inicio, $cantidad)
        return array_slice($lineas, -$cantidad);
    }
    
    /**
     * Limpia los errores almacenados en memoria (NO borra el archivo)
     * @return void
     */
    public static function limpiar(): void {
        self::$errores = [];
    }
    
    /**
     * Obtiene todos los errores de la sesión actual (en memoria)
     * @return array Array con todos los errores
     */
    public static function obtenerTodos(): array {
        return self::$errores;
    }
    
    /**
     * Borra el archivo de log completamente
     * @return bool true si se borró, false si no existe
     */
    public static function borrarArchivoLog(): bool {
        
        if (file_exists(self::$rutaLog)) {
            return unlink(self::$rutaLog);
        }
        
        return false;
    }
}
?>
