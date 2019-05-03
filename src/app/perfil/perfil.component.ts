import { Component, OnInit} from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as globals from '../globals/globals';
import { ToastrService } from 'ngx-toastr';

declare var $ :any;

declare var google;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  styles:[
  ]
})



export class PerfilComponent implements OnInit{

  public photo_profile: string =null;
  public name_profile: string =null;

  public isLogged: boolean = false;
  public typeUser: boolean = false;

  public id_user: string

  public modelProfile:any = {};
  public modelPassword: any = {};
  public error:any={};


  public inmuebles_match:any=[];

  public data:any=[];
  public solicitudata:any=[];


  public img:any={};
  public array:any;


  public _message_perfil: boolean = false;
  public message_text_perfil: String = null;

  public _message_img: boolean = false;
  public message_text_img: String = null;


  public message_c_valid:boolean = false;
  public message_text_contra: String = null;

  public latitud:string;
  public longitud:string;
  public p: number;
  public a: number;

  selectedFiles: FileList;



  public user:any={};



  public colors = ['red', 'blue','black'];

  constructor(
    private authService: AuthService ,
    private FirebaseService: FirebaseService,
    private router: Router,
    private toastr: ToastrService) {

  }



  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("users")) ;

    this.getCurrentUser();
    this.getInmueble();
    this.p=1;
    this.a=1;




  }







  getInmueble(){

    this.authService.isAuth().subscribe(auth => {
      if (auth) {

        this.id_user=auth.uid


            this.FirebaseService.getInmuebles(auth.uid).subscribe((res) => {
              this.data=res;



                /*for (const dato of this.data) {

                  this.FirebaseService.getImageInmueble(dato.id_inmueble).subscribe((res)=>{

                    this.img[dato.id_inmueble]=res[0]["url"]


                  })

                }*/



            })

            this.FirebaseService.getSolicitudesByUser(auth.uid).subscribe((res) => {
              this.solicitudata=res;


              this.sendInmueble();
            })




      }else {

      }
    });
  }



  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;

        if(auth.providerData[0].providerId=="facebook.com"){
          this.typeUser=true;
        }

            this.FirebaseService.getUserById(auth.uid).subscribe((res) => {
              this.modelProfile.nameProfile=res['name'];
              this.name_profile=res['name'];
              this.modelProfile.apellidoProfile=res['apellido'];
              this.modelProfile.email=res['email'];
              this.modelPassword.email=res['email'];
              this.photo_profile=res["photoUrl"];
              this.modelProfile.phoneNumber=res["telefono"];
            })

      }else {
        this.isLogged = false;
      }
    });
  }


onlyText(event) {
    const pattern = /[a-zA-ZñÑ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
}


onlyNumber(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
}


onUpdatePassword(form: NgForm):void{

  this.FirebaseService.verifyPassword(this.modelPassword.email,this.modelPassword.password,this.modelPassword.passwordNew)
  .then(

    success=> {
      this.message_c_valid= true,
      this.error.message="success",
      this.message_text_contra = success+"",
      form.reset(),
      setTimeout(()=>{
        this.message_c_valid = false;
        this.error.message = "";
        }, 5000);
    }

  ).catch(
    err=> {
      this.message_c_valid= true,
      this.error.message="error",
      this.message_text_contra = err+""
    }
  );

}



  onUpdatePerfilUser(): void {

    this.authService.isAuth().subscribe(auth => {

      if (auth) {

        auth.updateProfile({
        displayName: this.modelProfile.nameProfile,
        photoURL: auth.photoURL

      }).then((res) => {

        this.FirebaseService.updatePerfil(
          {
            name: this.modelProfile.nameProfile,
            telefono: this.modelProfile.phoneNumber,
            id:auth.uid,
            apellido:  this.modelProfile.apellidoProfile

          }).then((res) =>{

             this._message_perfil = true;
             this.message_text_perfil = "Se actualizaron los datos correctamente.";

             setTimeout(()=>{
             this._message_perfil = false;
             this.message_text_perfil = "";
             }, 5000);

          }).catch((err)=>

                console.log(err.message)

          );

      }).catch((err) => console.log(err.message));


    }
    });
  }





detectFiles(event) {
    this.selectedFiles = event.target.files;
}



uploadSingle() {
  this.authService.isAuth().subscribe(auth => {

    let file = this.selectedFiles.item(0);

    this.FirebaseService.uploadImage({
      name   : file.name,
      imagen : file,
      id     : auth.uid

    }).then((res) => {

      res.ref.getDownloadURL().then((url) => {

        auth.updateProfile({
          displayName: auth.displayName,
          photoURL: url
        }).then((resp) => {

          this.FirebaseService.updatePhotoUrl({
            image:url,
            id:auth.uid
          });

          this._message_img = true;
          this.message_text_img = "Se actualizo foto de perfil";

          setTimeout(()=>{
          this._message_img = false;
          this.message_text_img = "";
          }, 5000);


        }).catch((err) => console.log(err.message));

      }).catch((err) => console.log(err.message));

    }).catch((err) => console.log(err.message));

  })


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




redireccionar(href):void{

  this.router.navigate([href]);
}


editarInmueble(id){


  this.router.navigate([`editar-inmueble/${id}`]);
}


eliminarInmueble(id){


    if (confirm("Estas seguro de eliminar el inmueble ?")) {

      if(this.FirebaseService.deleteInmueble(id)){

        this.toastr.success('Inmueble se elimino correctamente.' );

      }else{

        console.log("error");
      }


    } else {

}

}

eliminarSolicitud(id,indice){

  if (confirm("Estas seguro de eliminar la solicitud ?")) {

    if(this.solicitudata[indice]["match"].length>0){

      this.toastr.error('Solicitud enlazada con inmuebles.' );

      return false;

    }
    this.FirebaseService.deleteSolicitud(id).then(res => {

      this.toastr.success('Solicitud se elimino correctamente.' );

    }).catch(err => {
       console.log(err)
    })

  } else {

}


}

editarSolicitud(id){

  this.router.navigate([`editar-solicitud/${id}`]);

}

setmapalat(coordenadas){

  let mapa= coordenadas.split(',');

   return parseFloat(mapa[0]);

 }

 setmapalon(coordenadas){

   let mapa= coordenadas.split(',');

    return parseFloat(mapa[1]);

  }



  viewSolicitud(id){

    this.router.navigate([`detalle-solicitud/${id}`]);

  }

  viewInmueble(id){
    this.router.navigate([`detalle-inmueble/${id}`]);


  }



  sendInmueble(){

     for (let index = 0; index < this.solicitudata.length; index++) {

      if (this.solicitudata[index]["match"].length>0){

        for (let index2 = 0; index2 < this.solicitudata[index]["match"].length; index2++) {

          this.FirebaseService.getInmueblesbyid(this.solicitudata[index]["match"][index2]).subscribe((res)=>{


            this.inmuebles_match[index2]=res


          })



        }




      }else{


      }

     }

     console.log(this.inmuebles_match);


     setTimeout(() => {
      console.clear()
     }
     , 300);



  }




}
