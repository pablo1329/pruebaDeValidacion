<?php
class gestionarPeticion{

	public function __construct(){}

	private function recibirPeticion():string {

    	$json = '';

    	$metodo = $_SERVER['REQUEST_METHOD'];

    	switch ($metodo) {
        	case 'GET':
            	$json = DATOS;
        	break;
        	case 'POST':
            	$input = file_get_contents('php://input');
            	$data = json_decode($input, true);
        	break;
    	}//fin switch

    	return json_encode($json);

	}//fin function recibirPeticion

}//fin gestionarPeticion
?>