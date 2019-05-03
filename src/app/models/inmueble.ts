export interface inmuebleInterface {
  id_inmueble?: string;
  id_user?: string;
  tipo_departamento?: string;
  operacion?: string;
  cuartos?: number;
  bano?: number;
  cochera?: number;
  vista?: string;
  tipo_depa?: string;
  amoblado?:string;
  area?:number;
  estreno?:string;
  proyecto?:string;
  presupuesto?:  {moneda?: string , precio?: number};
  mantenimiento?:  {moneda?: string , precio?: number};
  coddireccion?:string;
  direccion?:string;
  latitud?:number;
  longitud?:number;
  fecha?:string;
  image?:any;
  adicionales?:{
    terraza?:boolean,
    mascota?:boolean,
    deposito?:boolean,
    ascensor?:boolean,
    vigilancia?:boolean,
    servicio?:boolean,
    dscp?:boolean,
    reunion?:boolean,
    piscina?:boolean,
    gym?:boolean,
    parrilla?:boolean,
    juego?:boolean
  }
}


