export interface SolicitudInterface {
  id_solicitud?: string;
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
  match?:[];
  presupuesto?:  {moneda?: string , precio?: number};
  mantenimiento?:  {moneda?: string , precio?: number};
  comentario?:string;
  distrito?:[];
  radio?:any;
  distrito_radio?:[];

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

  fecha?:string;
  rango?:{
    de?:string;
    hasta?:string;
  }

}


