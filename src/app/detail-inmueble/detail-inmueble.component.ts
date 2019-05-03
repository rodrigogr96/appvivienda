import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable,NgZone } from '@angular/core';
import { ActivatedRoute,Params } from '@angular/router';
import * as globals from '../globals/globals';
import { AuthService } from '../servicios/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';




declare var $ :any;

@Component({
  selector: 'app-detail-inmueble',
  templateUrl: './detail-inmueble.component.html',
  styleUrls: ['./detail-inmueble.component.css']
})
export class DetailInmuebleComponent implements OnInit {

  public user:any={};
  public id_solicitud:string;
  public data :any;
  public posicion : any;
  public imageurl :any;

  public permision:any=[];

  public id_usuario:string;
  public isLogged: boolean = false;

  public email_data:any;

  public nombre_array:any;
  public nombre;


  public interes: boolean = false;


  constructor(private router: Router,
    private FirebaseService: FirebaseService,
    private spinner: NgxSpinnerService,
    private route:ActivatedRoute,
    private authService: AuthService,
    public http: HttpClient,
    private toastr: ToastrService
    ) { }

  ngOnInit() {

    this.route.params.subscribe(params=>{

      this.id_solicitud = params['id'];

    })


    this.getInmueble(this.id_solicitud);
    this.getCurrentUser();
    this.getAllUser();


    window.onkeyup = function (event) {
      if (event.keyCode == 27) {
        $(".visualizar").removeClass("mostrar");
      }
     }



  }

  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;

        this.id_usuario=auth.uid;


      }else {

        this.isLogged = false;
        this.id_usuario="error";


      }
    });
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

getInmueble(id){

  this.spinner.show();

  this.FirebaseService.getInmueblebyId(id).subscribe((res) => {


   if(res.length==0){

    this.router.navigate(['/home']);

    return false;


    }else{

      this.data=res;


    this.nombre_array= JSON.parse(localStorage.getItem("users"));

    this.nombre=this.nombre_array[this.data[0]["id_user"]];
    console.log(this.nombre);


      this.FirebaseService.getSolicitudContainInmueblebyId(id).subscribe((res)=>{
      this.permision=[];
      this.permision.push(this.data[0]["id_user"]);
      if(res.length==0){

      }else{

          for (let index = 0; index < res.length; index++) {
            this.permision.push(res[index]["id_user"]);

          }

      }

      if(this.permision.includes(this.id_usuario)){


      }else{

       this.data="";
       this.router.navigate(['/registro-solicitud']);


      }


      if(this.data[0]["id_user"]!=this.id_usuario){

        this.interes=true;
        console.log(this.interes);
      }





      });



    }

})
}

backButton(){

  window.history.back();
}

setDistrito(cod){
  let distrito = globals.DISTRICT_DIRECTION[cod].name
  return distrito
}

setprovincia(cod){

    let setear= cod.substr(0,4)

    let name = globals.PROVINCE_DIRECTION[setear].name

    return name
}

abrirImagen(pos){
  $(".visualizar").addClass("mostrar");


  this.posicion=pos;

  this.imageurl=this.data[0]["image"][pos]["url"];


}

cerrra_visualizar(){
  $(".visualizar").removeClass("mostrar");
}

btn_galeria(valor){

  let count = this.data[0]["image"].length;

  if(valor== 'l' && this.posicion==0){
    return false;
  }
   if(valor == 'r' && this.posicion==count-1){
    return false;
   }

  if(valor=='l'){
    this.posicion=this.posicion-1;

     this.imageurl=this.data[0]["image"][this.posicion]["url"];
  }

  if(valor=='r'){
    this.posicion=this.posicion+1;

    this.imageurl=this.data[0]["image"][this.posicion]["url"];
  }


}


postular(){
  this.spinner.show();

  if(localStorage.getItem(this.id_usuario)==this.data[0]["id_inmueble"]){

    this.spinner.hide();

    this.toastr.warning('Solo puede enviar sus datos una vez.');

    return false

  }else{

    localStorage.setItem(this.id_usuario,this.data[0]["id_inmueble"]);

  }



  this.FirebaseService.getUserById(this.id_usuario).subscribe((res)=>{


    this.email_data={
      nombre:res["name"],
      apellido:res["apellido"],
      email_solicitante:res["email"],
      celular:res["telefono"]
    }



    this.FirebaseService.getUserById(this.data[0].id_user).subscribe((res)=>{


        this.email_data.email_vendedor=res["email"]
        this.email_data.nombre_vendedor=res["name"]
        this.email_data.apellido_vendedor=res["apellido"]


this.http.post('https://sava.com.pe/send/send-email.php',
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
 });


    });



  })




}

}
