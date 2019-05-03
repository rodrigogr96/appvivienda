import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as globals from '../globals/globals';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public isLogged: boolean = false;
  public typeUser: boolean = false;
  public id_user: string

  public modelProfile:any = {};
  public modelPassword: any = {};
  public photo_profile: string =null;
  public name_profile: string =null;



  public inmuebles_match:any=[];
  public data:any=[];
  public solicitudata:any=[];

  public error:any={};

  selectedFiles: FileList;

  tab:any;
  public user:any={};

  public _message_perfil: boolean = false;
  public message_text_perfil: String = null;

  public _message_img: boolean = false;
  public message_text_img: String = null;


  public message_c_valid:boolean = false;
  public message_text_contra: String = null;



  public colors = ['red', 'blue','black'];

  constructor(
    private authService: AuthService ,
    private FirebaseService: FirebaseService,
    private router: Router,
    private toastr: ToastrService) {
      this.getCurrentUser();
  }

  ngOnInit() {


    this.user = JSON.parse(localStorage.getItem("users")) ;
    this.getSolicitud();
    this.getInmueble();
    this.tab=1
  }


  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {

        this.id_user=auth.uid;
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
        this.id_user="";
      }

    });
  }


  getSolicitud(){

    let id = this.id_user

    this.FirebaseService.getSolicitudesByUser(id).subscribe((res) => {
      this.solicitudata=res;

    this.sendInmueble();

    })


  }

  tabs(id){

    this.tab=id;

  }

  getInmueble(){

    let id = this.id_user

    this.FirebaseService.getInmuebles(id).subscribe((res) => {
      this.data=res;

    })


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

setmapalat(coordenadas){
   let mapa= coordenadas.split(',');
   return parseFloat(mapa[0]);
}

setmapalon(coordenadas){
   let mapa= coordenadas.split(',');
   return parseFloat(mapa[1]);
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


viewSolicitud(id){

  this.router.navigate([`detalle-solicitud/${id}`]);

}

viewInmueble(id){
  this.router.navigate([`detalle-inmueble/${id}`]);


}


redireccionar(href):void{

  this.router.navigate([href]);
}


sendInmueble(){
  for (let index = 0; index < this.solicitudata.length; index++) {

   if (this.solicitudata[index]["match"].length>0){

     for (let index2 = 0; index2 < this.solicitudata[index]["match"].length; index2++) {

       this.FirebaseService.getInmueblesbyid(this.solicitudata[index]["match"][index2]).subscribe((res)=>{


         this.inmuebles_match[this.solicitudata[index]["match"][index2]]=res


       })



     }




   }else{


   }

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

editarInmueble(id){


  this.router.navigate([`editar-inmueble/${id}`]);
}


eliminarInmueble(id){


   if (confirm("Estas seguro de eliminar el inmueble ?")) {

    this.FirebaseService.deleteCountInmueble(id).subscribe((res)=>{

      if(res.length>0){
        this.toastr.error('Inmueble enlazado con solicitudes.' );
      }else{

        if(this.FirebaseService.deleteInmueble(id)){

          this.toastr.success('Inmueble se elimino correctamente.' );

        }else{

          console.log("error");
        }

      }
    })




    } else {

}

}

}
