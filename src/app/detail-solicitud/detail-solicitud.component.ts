import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable,NgZone } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import * as globals from '../globals/globals';
import { AuthService } from '../servicios/auth.service';
import { ToastrService } from 'ngx-toastr';

import {HttpClient, HttpHeaders} from '@angular/common/http';


declare var $ :any;


@Component({
  selector: 'app-detail-solicitud',
  templateUrl: './detail-solicitud.component.html',
  styleUrls: ['./detail-solicitud.component.css']
})


export class DetailSolicitudComponent implements OnInit {

  public user:any={};
  public id_solicitud:string;
  public data :any;

  public noMatch:any=[];
  public id_inmueble:string="";

  public matchid:any=[];

  public data_res :any=[];

  public arrayInmueble:any=[];
  public colors = ['red', 'blue','black'];


  public email_data:any;

  public filtro:any;


  public inmueble : any=[];


  public permision:any=[];


  public isLogged: boolean = false;
  public id_user_inmueble:string;

  public data_user_solicitud:any


  constructor(
    private authService: AuthService ,
    private router: Router,
    private FirebaseService: FirebaseService,
    private spinner: NgxSpinnerService,
    private route:ActivatedRoute,
    private toastr: ToastrService,
    public http: HttpClient,)
  {}

  ngOnInit() {




    this.route.params.subscribe(params=>{

      this.id_solicitud = params['id'];

    })




    this.getAllUser();

    this.getCurrentUser();

    this.getSolicitud(this.id_solicitud);





  }

  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        this.id_user_inmueble=auth.uid;

      }else {
        this.isLogged = false;
        this.id_user_inmueble="";
      }
    });
  }


  backButton(){

    window.history.back();
  }

  setDistrito(cod){
    let distrito = globals.DISTRICT_DIRECTION[cod].name
    return distrito
  }

  setfecha(fecha){

    return fecha.toDate();
  }

  getAllUser(){


    this.FirebaseService.getallUser().subscribe((res) => {
     let name = "";

        for (let index = 0; index < res.length; index++) {

          name = res[index]["name"].split(" ");
          this.user[res[index]["id"]]=name[0].toUpperCase();

        }

        localStorage.setItem("users",  JSON.stringify(this.user));

        this.spinner.hide();
    });


}

data_user_soli(){
  this.FirebaseService.getbyIdUser(this.data[0].id_user).subscribe((res)=>{
   this.data_user_solicitud=res;

  })

}


getSolicitud(id){

  this.spinner.show();

  this.FirebaseService.getSolicitudesbyId(id).subscribe((res) => {


   if(res.length==0){

    this.data="";


    this.router.navigate(['/home']);


    }else{

    this.data=res;

    this.filtro={
      ordenar:'desc',
      id_user:'',
      tipo_departamento:this.data[0].tipo_departamento,
      operacion:this.data[0].operacion,
      cuartos:this.data[0].cuartos,
      bano:this.data[0].bano,
      cochera:this.data[0].cochera,
      vista:this.data[0].vista,
      tipo_depa:this.data[0].tipo_depa,
      amoblado:this.data[0].amoblado,
      estreno:this.data[0].estreno,
      proyecto:this.data[0].proyecto,
      area:this.data[0].area,
      presupuesto:this.data[0].presupuesto,
      mantenimiento:this.data[0].mantenimiento,
      distrito:this.data[0].distrito,
      radio:this.data[0].radio,
      ascensor:this.data[0].adicionales.ascensor,
      deposito:this.data[0].adicionales.deposito,
      dscp:this.data[0].adicionales.dscp,
      gym:this.data[0].adicionales.gym,
      juego:this.data[0].adicionales.juego,
      mascota:this.data[0].adicionales.mascota,
      parrilla:this.data[0].adicionales.parrilla,
      piscina:this.data[0].adicionales.piscina,
      reunion:this.data[0].adicionales.reunion,
      servicio:this.data[0].adicionales.servicio,
      terraza:this.data[0].adicionales.terraza,
      vigilancia:this.data[0].adicionales.vigilancia
    }


    this.listarInmueble();

    this.data_user_soli();





    }

})
}

setmapalat(coordenadas){

  let mapa= coordenadas.split(',');

   return parseFloat(mapa[0]);

 }

 setmapalon(coordenadas){

   let mapa= coordenadas.split(',');

    return parseFloat(mapa[1]);

  }

  match(){

    if (this.isLogged) {

      this.filtro["id_user"]=this.id_user_inmueble;

      if(this.id_user_inmueble==this.data[0].id_user){

        this.toastr.warning('No puedes postular a tu misma solicitud.' );
        return false
      }

      this.FirebaseService.getMatch(this.filtro).subscribe((res)=>{


        $("#modal_list_inmuebles").modal('show');

        if(res.length>0){


         this.arrayInmueble=res



        }else{

          console.log("Registrar Inmueble")

        }


      })



    }else{

      $("#exampleModalCenter").modal('show');

    }

  }

  select(indice,id){


    this.noMatch=[];
    this.id_inmueble="";

    if(this.filtro["tipo_departamento"]==this.arrayInmueble[indice]["tipo_departamento"]){

    }else{
      this.noMatch.push({
        name:"Tipo",
        valor1:this.filtro["tipo_departamento"],
        valor2:this.arrayInmueble[indice]["tipo_departamento"]
      })
    }

    if(this.filtro["operacion"]==this.arrayInmueble[indice]["operacion"]){

    }else{
      this.noMatch.push({
        name:"Operacion",
        valor1:this.filtro["operacion"],
        valor2:this.arrayInmueble[indice]["operacion"]
      })
    }

    if(this.filtro["cuartos"]>this.arrayInmueble[indice]["cuartos"]){

      this.noMatch.push({
        name:"Dormitorio",
        valor1:this.filtro["cuartos"],
        valor2:this.arrayInmueble[indice]["cuartos"]
      })

    }else{

    }

    if(this.filtro["bano"]>this.arrayInmueble[indice]["bano"]){

      this.noMatch.push({
        name:"Baño",
        valor1:this.filtro["bano"],
        valor2:this.arrayInmueble[indice]["bano"]
      })

    }else{

    }

    if(this.filtro["cochera"]=='NO'){
      if (this.filtro["cochera"]==this.arrayInmueble[indice]["cochera"]){

      }else{
        this.noMatch.push({
          name:"Cochera",
          valor1:this.filtro["cochera"],
          valor2:this.arrayInmueble[indice]["cochera"]
        })
      }
      //this.arrayInmueble = this.arrayInmueble.filter(elem => elem.cochera == this.filtro["cochera"] );
    }else{

      if (this.filtro["cochera"]>this.arrayInmueble[indice]["cochera"]){

        this.noMatch.push({
          name:"Cochera",
          valor1:this.filtro["cochera"],
          valor2:this.arrayInmueble[indice]["cochera"]
        })

      }else{

      }
    }

    if(this.filtro["vista"]=='INDISTINTO'){

    }else{
      if (this.filtro["vista"]==this.arrayInmueble[indice]["vista"]){

      }else{
        this.noMatch.push({
          name:"Vista",
          valor1:this.filtro["vista"],
          valor2:this.arrayInmueble[indice]["vista"]
        })
      }
    }

    if(this.filtro["tipo_depa"]=='INDISTINTO'){

    }else{
      if (this.filtro["tipo_depa"]==this.arrayInmueble[indice]["tipo_depa"]){

      }else{
        this.noMatch.push({
          name:"Tipo",
          valor1:this.filtro["tipo_depa"],
          valor2:this.arrayInmueble[indice]["tipo_depa"]
        })
      }
    }

    if(this.filtro["amoblado"]=='INDISTINTO'){

    }else{
      if (this.filtro["amoblado"]==this.arrayInmueble[indice]["amoblado"]){

      }else{
        this.noMatch.push({
          name:"Amoblado",
          valor1:this.filtro["amoblado"],
          valor2:this.arrayInmueble[indice]["amoblado"]
        })
      }
    }

    if(this.filtro["estreno"]=='INDISTINTO'){

    }else{
      if (this.filtro["estreno"]==this.arrayInmueble[indice]["estreno"]){

      }else{
        this.noMatch.push({
          name:"Estreno",
          valor1:this.filtro["estreno"],
          valor2:this.arrayInmueble[indice]["estreno"]
        })
      }
    }

    if(this.filtro["proyecto"]=='INDISTINTO'){

    }else{
      if (this.filtro["proyecto"]==this.arrayInmueble[indice]["proyecto"]){

      }else{
        this.noMatch.push({
          name:"Proyecto",
          valor1:this.filtro["proyecto"],
          valor2:this.arrayInmueble[indice]["proyecto"]
        })
      }
    }

    if(this.filtro["area"]>=this.arrayInmueble[indice]["area"]){

    }else{
      this.noMatch.push({
        name:"Área",
        valor1:this.filtro["area"],
        valor2:this.arrayInmueble[indice]["area"]
      })
    }

    if(this.filtro["presupuesto"].precio>=this.arrayInmueble[indice]["presupuesto"]["precio"]){

    }else{
      this.noMatch.push({
        name:"Presupuesto",
        valor1:this.filtro["presupuesto"].precio,
        valor2:this.arrayInmueble[indice]["presupuesto"]["precio"]
      })
    }

    if(this.filtro["mantenimiento"].precio>=this.arrayInmueble[indice]["mantenimiento"]["precio"]){

    }else{
      this.noMatch.push({
        name:"Mantenimiento",
        valor1:this.filtro["mantenimiento"].precio,
        valor2:this.arrayInmueble[indice]["mantenimiento"]["precio"]
      })
    }

    if(this.filtro["terraza"] == true ){
      if(this.filtro["terraza"]== this.arrayInmueble[indice]["adicionales"]["terraza"]){

      }else{
        this.noMatch.push({
          name:"Terraza",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["dscp"] == true ){
      if(this.filtro["dscp"]== this.arrayInmueble[indice]["adicionales"]["dscp"]){

      }else{
        this.noMatch.push({
          name:"Discapacitados",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["gym"] == true ){
      if(this.filtro["gym"]== this.arrayInmueble[indice]["adicionales"]["gym"]){

      }else{
        this.noMatch.push({
          name:"Gym",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["juego"] == true ){
      if(this.filtro["juego"]== this.arrayInmueble[indice]["adicionales"]["juego"]){

      }else{
        this.noMatch.push({
          name:"Juego",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["mascota"] == true ){
      if(this.filtro["mascota"]== this.arrayInmueble[indice]["adicionales"]["mascota"]){

      }else{
        this.noMatch.push({
          name:"Mascota",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["parrilla"] == true ){
      if(this.filtro["parrilla"]== this.arrayInmueble[indice]["adicionales"]["parrilla"]){

      }else{
        this.noMatch.push({
          name:"Parrilla",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["piscina"] == true ){
      if(this.filtro["piscina"]== this.arrayInmueble[indice]["adicionales"]["piscina"]){

      }else{
        this.noMatch.push({
          name:"Piscina",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["reunion"] == true ){
      if(this.filtro["reunion"]== this.arrayInmueble[indice]["adicionales"]["reunion"]){

      }else{
        this.noMatch.push({
          name:"Reunión",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["servicio"] == true ){
      if(this.filtro["servicio"]== this.arrayInmueble[indice]["adicionales"]["servicio"]){

      }else{
        this.noMatch.push({
          name:"Servicio",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["vigilancia"] == true ){
      if(this.filtro["vigilancia"]== this.arrayInmueble[indice]["adicionales"]["vigilancia"]){

      }else{
        this.noMatch.push({
          name:"Vigilancia",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }


    if(this.filtro["deposito"] == true ){
      if(this.filtro["deposito"]== this.arrayInmueble[indice]["adicionales"]["deposito"]){

      }else{
        this.noMatch.push({
          name:"Deposito",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }

    if(this.filtro["ascensor"] == true ){
      if(this.filtro["ascensor"]== this.arrayInmueble[indice]["adicionales"]["ascensor"]){

      }else{
        this.noMatch.push({
          name:"Ascensor",
          valor1:"SI",
          valor2:"NO"
        })
      }
    }


    if(this.filtro["distrito"].length>0){

      if(this.filtro["distrito"].includes(this.arrayInmueble[indice]["coddireccion"])){


      }else{

        let name_distrito="";

        for (let index = 0; index < this.filtro["distrito"].length; index++) {
          name_distrito += this.setDistrito(this.filtro["distrito"][index])+" "
        }

        let name_distrito_val2 = this.setDistrito(this.arrayInmueble[indice]["coddireccion"])

        this.noMatch.push({
          name:"Distrito",
          valor1:name_distrito,
          valor2:name_distrito_val2
        })

      }

    }else{


    }


    if(this.noMatch.length>0){

      $("#modal_list_inmuebles").modal('hide');

      this.spinner.show();

      setTimeout(() => {

        this.spinner.hide();
        $("#modal_nomatch").modal('show');
      }, 5000);

      this.id_inmueble=id



    }else{

      this.spinner.show();

      this.FirebaseService.getMatchSI(this.data[0]["id_solicitud"],this.arrayInmueble[indice]["id_inmueble"]).subscribe((res)=>{

        this.data_res = res.size;



        this.functioncontar(indice,id) ;

      })

    }

  }


  functioncontar(indice,id){

    $("#modal_list_inmuebles").modal('hide');

    let boolean;

    if(this.data_res>0){

    this.spinner.hide();

    this.toastr.warning('Inmueble se encuentra registrado' );

     boolean=false;

     }else{

      this.matchid=this.data[0]["match"]

      this.matchid.push(this.arrayInmueble[indice]["id_inmueble"]);

      this.FirebaseService.updateSolicitud(this.data[0]["id_solicitud"], this.matchid).then((res)=>{

        this.email_data={
          nombre_solicitud:this.user[this.data[0].id_user],
          nombre_inmueble:this.user[this.id_user_inmueble],
          email_solicitud:this.data_user_solicitud["email"],
          codigo:id
        }

       console.log(this.email_data);

       this.http.post('https://sava.com.pe/send/send-email-solicitud.php',
       JSON.stringify(this.email_data),
       {responseType: 'text'}
       ).subscribe((res) =>{

        if(res){

          $("#modal_exitoso").modal('show');

          this.spinner.hide();

        }else{


        }
       },(err)=>{

        console.log(err);
        this.spinner.hide();
       })



        /*this.http.post('https://sava.com.pe/send/send-email.php',
        JSON.stringify(this.email_data),
        {responseType: 'text'}
        ).subscribe((res)=>{

         if(res){


           this.spinner.hide();

           $("#modal_email").modal('show');

           console.log(res);


         }else{
           alert("error");

           this.spinner.hide();
         }


        },(err)=>{

         alert(err);
         this.spinner.hide();
        });*/



      })

      boolean=true;

     }



  }

  listarInmueble(){

    this.inmueble=[]


    for (let index = 0; index < this.data[0]["match"].length; index++) {


      this.FirebaseService.getInmuebleByID(this.data[0]["match"][index]).subscribe((res)=>{

        this.inmueble[index]=res

      });

      }

    }


    viewInmueble(id_inmueble){

     this.permision=[]

     this.permision.push(this.data[0]["id_user"])

     this.FirebaseService.getInmuebleByID(id_inmueble).subscribe((res)=>{

            this.permision.push(res["id_user"])


            if(this.permision.includes(this.id_user_inmueble)){

              this.router.navigate([`detalle-inmueble/${id_inmueble}`]);

            }else{

              $("#modal_permiso").modal('show');


            }

      });



    }




  redireccionar(href):void{

    this.router.navigate([href]);
    $("#modal_list_inmuebles").modal('hide');
    $("#modal_permiso").modal('hide');
  }

  editarInmueble(id):void{

    this.router.navigate([`editar-inmueble/${id}`]);
    $("#modal_nomatch").modal('hide');
  }

  setprovincia(cod){

      let setear= cod.substr(0,4)

      let name = globals.PROVINCE_DIRECTION[setear].name

      return name
  }


}
