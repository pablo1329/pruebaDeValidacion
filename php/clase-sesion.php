<?php
session_start();

class Sesion {

	public function __construct(){}// fin constructor


	private function iniciarSesion(int $id_usuario, string $usuario, string $tipoDeUsuario) {
		
		//Establecemos el tiempo de vida de la session en 20 minutos.
		$tiempoDeVidaDeSesion = time() + 1200;

		//Creamos el id de sesion.
		$idDeSesion = $id_usuario . "_" . $usuario;

		//Ingresamos los datos en el array global de sesion.
		$_SESSION[$idDeSesion] = ['idDeUsuario'=>$id_usuario,
								  'usuario'=>$usuario, 
								  'tipoDeUsuario'=>$tipoDeUsuario,
								  'vidaDeSesion'=>$tiempoDeVidaDeSesion];

		return $_SESSION[$idDeSesion];

	}//finfunction iniciarSesion


	private function comprobarVidaDeSesion(string $idDeSesion) {

		$tiempoDeVidaDeSesion = $_SESSION[$idDeSesion]['vidaDeSesion'] - time();
	
		if ($tiempoDeVidaDeSesion <= 0) {

        	unset($_SESSION[$idDeSesion]);

        	throw new Exception("El tiempo de sesión ha caducado");

    	}

    	//Reestablecer el tiempo de vida si la sesión sigue activa
   		$_SESSION[$idDeSesion]['vidaDeSesion'] = time() + 1200; // 20 minutos más

	}//fin function comprobarVidaDeSesion


	private function controlDeSesion(int $id, string $usuario, string $tipoDeUsuario) {
		
		$idDeSesion = $id . "_" . $usuario;

        //Se verifica si existe la sesión
        if (!isset($_SESSION[$idDeSesion]) ) {
        	throw new Exception("El usuario no se encuentra almacenado en el array de SESION");
        }

        // Verificar credenciales
        if ($_SESSION[$idDeSesion]['usuario'] !== $usuario ||
            $_SESSION[$idDeSesion]['tipoDeUsuario'] !== $tipoDeUsuario) {
           throw new Exception("El usuario: $usuario y/o tipo de usuario: $tipoDeUsuario no coinciden con los valores almacenados en el array de SESION");
        }

        return $this->comprobarVidaDeSesion($idDeSesion);

    }//fin function controlDeSesion


    private function destruirSesion(int $id, string $usuario){

    	$idDeSesion = $id . "_" . $usuario;
		
		//Se verifica si existe la sesión
        if (!isset($_SESSION[$idDeSesion]) ) {
        	throw new Exception("El usuario no se encuentra almacenado en el array de SESION");
        }

		unset($_SESSION[$idDeSesion]);

		session_destroy();

		return 'La sesión fue destruida';

	}//fin function destruirSesion


	public function devolverDestruirSesion(int $id, string $usuario){
		return $this->destruirSesion($id, $usuario);
	}//fin function devolverDestruirSesion


    public function devolverControlDeSesion(int $id, string $usuario, string $tipoDeUsuario){
    	return $this->controlDeSesion($id, $usuario, $tipoDeUsuario);
    }//fin function devolverControlDeSesion


	public function devolverIniciarSesion(int $id_usuario, string $usuario, string $tipoDeUsuario) {
		return $this->iniciarSesion($id_usuario, $usuario, $tipoDeUsuario);
	}//fin function devolverIniciarSesion


}//fin class Sesion

?>