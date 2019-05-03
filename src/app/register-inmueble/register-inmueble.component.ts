import { Component, OnInit,ElementRef,ViewChild,NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { Router } from '@angular/router';
import * as globals from '../globals/globals';
import { MapsAPILoader } from '@agm/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

declare var google;
declare var $ :any;
class RequestDepartment {
	id: string
	value: any
}

class upload {
	name: any
  id_image: any
  id_inmueble:any
  url:any
}

@Component({
  selector: 'app-register-inmueble',
  templateUrl: './register-inmueble.component.html',
  styleUrls: ['./register-inmueble.component.css']
})
export class RegisterInmuebleComponent implements OnInit {

  public register:any = {};
  public isLogged: boolean = false;
  public user:string;


  public objDepart: any;
	public keyDeparts: string[];
  public selectDepart: any;
  public departSeleccionado  = 0;

  public objProvs: any;
	public showProvs = new Array();
	public keyProvs: string[];
	public selectProv: any;
  public proviSeleccionado = 0;

  public objDists: any;
	public showDists = new Array();
	public selectDistric: any;
	public keyDistrs: string[];
  public districSeleccionado = 0;

  public latitude: number;
  public longitude: number;
  public latitude_m: number;
  public longitude_m: number;
  public zoom:number;
  public urls = [];
  public urlsdb : FileList[];
  public posicion : any;
  public total:any;
  public count :any;

  public isvacacional:boolean=true;


  public image=[];


  downloadURL: Observable<string>;




  @ViewChild("search")
  public searchElementRef: ElementRef;


  constructor(private authService: AuthService ,
     private FirebaseService: FirebaseService,
     private router: Router,
     private mapsAPILoader: MapsAPILoader,
     private ngZone: NgZone,
     private afs: AngularFirestore,
     private spinner: NgxSpinnerService,
     private afStorage: AngularFireStorage,
     private toastr: ToastrService) { }

  ngOnInit() {

    this.reset();
    this.obtenerDepartamentos();
    this.getCurrentUser();
    this.zoom=12;
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"],
        componentRestrictions: { country: 'PE'}
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place = google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          var geocoder = new google.maps.Geocoder;


          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.latitude_m = place.geometry.location.lat();
          this.longitude_m = place.geometry.location.lng();

          this.zoom=15;

          this.register.latitud=this.latitude
          this.register.longitud=this.longitude

          this.geocodeLatLng(geocoder,place.geometry.location.lat(),place.geometry.location.lng())



        });
      });
    });





     this.changeCheckbox();

     window.onkeyup = function (event) {
      if (event.keyCode == 27) {
        $(".visualizar").removeClass("mostrar");
      }
     }


  }


  geocodeLatLng(geocoder,lat,long) {
    var latlng = {
      lat: lat,
      lng: long
    };
    geocoder.geocode({
      'location': latlng
    }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {



        } else {
        }
      } else {
      }
    });
  }

  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        this.user=auth.uid;

      }else {
        this.isLogged = false;
        this.user="";
      }
    });
  }


  reset(){
    this.register.type_apar="DEPARTAMENTO"
    this.register.operation="ALQUILER"
    this.register.door=1
    this.register.bano=1
    this.register.cochera="NO"
    this.register.vista="INTERNA"
    this.register.tipo="FLAT"
    this.register.amoblado="FULL"
    this.register.man_type="SOLES"
    this.register.pre_type="SOLES"
    this.register.proyecto="SI"
    this.register.estreno="SI"
    this.register.terraza=false
    this.register.mascota=false
    this.register.deposito=false
    this.register.ascensor=false
    this.register.vigilancia=false
    this.register.servicio=false
    this.register.dscp=false
    this.register.reunion=false
    this.register.piscina=false
    this.register.gym=false
    this.register.parrilla=false
    this.register.juego=false
    this.register.departamento=""
    this.register.distrito=""
    this.register.provincia=""
    this.register.area=""
    this.register.pre_price=""
    this.register.man_price=""
    this.register.direccion=""
    this.latitude=-12.114090
    this.longitude=-77.027842
    this.latitude_m = 0
    this.longitude_m = 0

    this.register.latitud= 0
    this.register.longitud= 0

    this.urls= []
    this.urlsdb=[]

    $(".chb").removeClass("pintar");
    $('input:radio[name="type_apar"][value="DEPARTAMENTO"]').click();
    $('input:radio[name="operation"][value="ALQUILER"]').click();
    $('input:radio[name="door"][value="1"]').click();
    $('input:radio[name="bano"][value="1"]').click();
    $('input:radio[name="cochera"][value="NO"]').click();
    $('input:radio[name="vista"][value="INTERNA"]').click();
    $('input:radio[name="tipo"][value="FLAT"]').click();
    $('input:radio[name="amoblado"][value="FULL"]').click();
    $('input:radio[name="estreno"][value="SI"]').click();
    $('input:radio[name="proyecto"][value="SI"]').click();



  }

onlyNumber(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
}

onlyDireccion(event) {
  const pattern = /[a-zA-ZñÑ 0-9.-]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (!pattern.test(inputChar)) {
    event.preventDefault();
  }
}



registerInmueble(form: NgForm){

      if (this.isLogged) {
        this.spinner.show();
        this.register.fecha=new Date();
        this.register.user=this.user;
        /*this.register.departamento_=globals.DEPARTMENTS_DIRECTION[this.register.departamento].name;
        this.register.provincia_=globals.PROVINCE_DIRECTION[this.register.departamento+this.register.provincia].name;*/
        this.register.distrito_=this.register.departamento+this.register.provincia+this.register.distrito
        this.register.id = this.afs.createId();

      if(this.register.latitud== 0 || this.register.longitud==0){
        this.spinner.hide();
        this.toastr.warning('Debe buscar una direccion' );

        return false;
      }

      if(this.urlsdb.length<3){
        this.spinner.hide();
        this.toastr.warning('Debe agregar un minimo de 3 fotos' );

        return false;
      }



        this.FirebaseService.register_inmueble(this.register).then((res) =>{

          this.count = 0;

          this.total=this.urlsdb.length

          for (const file of this.urlsdb) {

            const path = `inmuebles/${this.register.id}/${file["name"]}`;
            const ref = this.afStorage.ref(path);
            const task = this.afStorage.upload(path, file);


            let id = this.afs.createId();

            task.snapshotChanges().pipe(

              finalize(() => {
                ref.getDownloadURL().subscribe(url => {
                  this.downloadURL = url;



                  this.image.push({
                    url:this.downloadURL,
                    name:file["name"],
                    id_image:id,
                    id_inmueble:this.register.id

                  })

                  console.log(this.image);

                  this.FirebaseService.uploadFiles(this.register.id,this.image).then((res)=>{

                  });


                    this.count++;


                  if(this.urlsdb.length == this.count ){



                  this.spinner.hide();

                  form.reset();
                  this.reset();
                  $("#modal_ok").modal('show');



                  }




                })



              })
            ).subscribe()
}

       })


      }else {

        $("#exampleModalCenter").modal('show');

      }



}


  cerrar():void{

    $("#modal_ok").hide();
    $(".modal-backdrop").hide();

    this.router.navigate(['perfil']);
  }

  sortByTwoProperty = () => {
		return (x, y) => {
			return ((x["value"]["name"] === y["value"]["name"]) ? 0 : ((x["value"]["name"] > y["value"]["name"]) ? 1 : -1));
		}
  }

  sortByProperty = (property) => {
		return (x, y) => {
			return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
		}
	}

  obtenerDepartamentos() {
    this.objDepart = globals.DEPARTMENTS_DIRECTION;
		let arrayDepartments: RequestDepartment[] = Array()
		this.keyDeparts = []
		for (let i in this.objDepart) {
			let obj = new RequestDepartment()
			obj.id = i
			obj.value = this.objDepart[i]
			arrayDepartments.push(obj)
		}
		arrayDepartments.sort(this.sortByTwoProperty())
		for (let i = 0; i < arrayDepartments.length; i++) {
			this.keyDeparts.push(arrayDepartments[i]["id"])
		}
  }

  selDepart() {
		this.selectDepart = document.getElementById("department");
    this.departSeleccionado = this.selectDepart.value;
    this.listarProvincias(this.departSeleccionado);

    this.selCity();


	}

  listarProvincias(skuDep) {
    this.objProvs = globals.PROVINCE_DIRECTION;
		this.showProvs.length = 0;
		this.keyProvs = Object.keys(this.objProvs);
		this.keyProvs.forEach((item, index) => {
			if (this.objProvs[item].skuDep == skuDep) {
				this.showProvs.push(this.objProvs[item]);
			}

		})
  }

  selCity() {

		this.selectProv = document.getElementById("city");
    this.proviSeleccionado = this.selectProv.value;
    this.listarDistritos(this.departSeleccionado + this.proviSeleccionado);
    this.selDistrict();

  }

  listarDistritos(skuDepPro) {

    this.objDists = globals.DISTRICT_DIRECTION;
		this.showDists.length = 0;
		this.keyDistrs = Object.keys(this.objDists);
		this.keyDistrs.forEach((item, index) => {

			if (this.objDists[item].skuDepPro == skuDepPro) {
				this.showDists.push(this.objDists[item]);

			}
			this.showDists.sort(this.sortByProperty("name"))
		})

  }

  selDistrict() {
		this.selectDistric = document.getElementById("district");
    this.districSeleccionado = this.selectDistric.value;
	}

  changeCheckbox(){


    //Ten en cuenta que estamos seleccionando por clase label-cliente. Como estamos jugando con los children (en este caso los input) no deberías tener problemas si tienes varios label/input pero tenlo en cuenta.
    $(".chb").click(function(){
      //Si el hijo está checked le ponemos a la label el color #2d89ef si no el #5e5e5e
      if($(this).children().is(":checked"))
      {
        $(this).addClass("pintar");
      }
      else
      {
        $(this).removeClass("pintar");
      }
    });

  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {

            var isjpgopng= event.target.files[i]["name"];

            var existejpg = isjpgopng.search(".jpg");
            var existeJPG = isjpgopng.search(".JPG");
            var existepng = isjpgopng.search(".png");
            var existePNG = isjpgopng.search(".PNG");
            var existeJPEG = isjpgopng.search(".JPEG");
            var existejpeg = isjpgopng.search(".jpeg");

            if(existejpg!=-1  || existepng!=-1 || existejpeg!=-1 || existeJPG!=-1 || existeJPEG!=-1 || existePNG!=-1  ){

              if(this.urlsdb.length<10){



                var reader = new FileReader();

                  reader.onload = (events:any) => {
                     this.urls.push(events.target.result);
                  }


                  this.urlsdb.push(event.target.files[i]);




                  reader.readAsDataURL(event.target.files[i]);

              }else{


                this.toastr.warning('Solo puede Seleccionar 10 imagenes' );

              }



            }else{

              this.toastr.error(`${event.target.files[i]["name"]} no es una imagen.` );
            }


        }
    }
  }

  abrirImagen(pos){
    $(".visualizar").addClass("mostrar");
    this.posicion=pos;
  }

  eliminarImagen(pos){
    event.stopPropagation();
    this.urlsdb.splice(pos, 1);
    this.urls.splice(pos, 1);
  }

  cerrra_visualizar(){
    $(".visualizar").removeClass("mostrar");
  }


  btn_galeria(valor){

    let count = this.urls.length;

    if(valor== 'l' && this.posicion==0){
      return false;
    }
     if(valor == 'r' && this.posicion==count-1){
      return false;
     }

    if(valor=='l'){
      this.posicion=this.posicion-1;
    }

    if(valor=='r'){
      this.posicion=this.posicion+1;
    }


  }


  changeExit(valor){

    this.register.type_apar=valor;



    if(valor == "OFICINA" || valor == "TERRENO" ){

    $('input:radio[name="operation"][value="ALQUILER"]').click();
      this.isvacacional=false;


    }else{

      this.isvacacional=true;

    }

  }



}
