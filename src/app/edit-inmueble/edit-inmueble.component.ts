import { Component, OnInit,NgZone,ElementRef,ViewChild } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FirebaseService } from '../servicios/firebase.service';
import { MapsAPILoader } from '@agm/core';
import * as globals from '../globals/globals';
declare var $ :any;
import { AuthService } from '../servicios/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { AngularFirestore} from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { finalize, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

declare var google;

class RequestDepartment {
	id: string
	value: any
}

@Component({
  selector: 'app-edit-inmueble',
  templateUrl: './edit-inmueble.component.html',
  styleUrls: ['./edit-inmueble.component.css']
})
export class EditInmuebleComponent implements OnInit {

  public id_inmueble:string;
  public id_usuario:string;
  public isLogged: boolean = false;

  public data :any;
  public register:any = {};

  public istrue:boolean;


  public isvacacional:boolean=true;

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

  public posicion : any;
  public total:any;
  public count :any;

  public urlsdb = [];
  public urlsDBeliminar=[];

  public url=[];
  public urlAddDB : FileList[]=[];

  downloadURL: Observable<string>;


  /*public image=[];
  public urlsdb : FileList[];
  public urlsEliminar=[];*/


  constructor(private authService: AuthService ,
    private FirebaseService: FirebaseService,
    private router: Router,
    private route:ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService,
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService) { }


    @ViewChild("search")
    public searchElementRef: ElementRef;

  ngOnInit() {

    this.obtenerDepartamentos();
    this.getCurrentUser();

    this.changeCheckbox();

    window.onkeyup = function (event) {
      if (event.keyCode == 27) {
        $(".visualizar").removeClass("mostrar");
      }
     }

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




        });
      });
    });

  }

  getCurrentUser() {

    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.isLogged = true;

        this.id_usuario=auth.uid;


        this.route.params.subscribe(params=>{

        this.id_inmueble = params['id'];



        })

        this.getEdit(this.id_usuario,this.id_inmueble);



      }else {

        this.isLogged = false;


      }
    });
  }

  getEdit(id1,id2){

    this.FirebaseService.geteditInmueble(id1,id2).subscribe((res)=>{



      if(res.length==0){

        this.data="";
        this.router.navigate(['/perfil']);

      this.istrue=false;

      }else{


        this.istrue = true;
        this.data = res;

      this.register.type_apar=this.data[0]["tipo_departamento"]
      $(`input:radio[name="type_apar"][value=${this.data[0]["tipo_departamento"]}]`).click();
      this.register.operation=this.data[0]["operacion"]
      $(`input:radio[name="operation"][value=${this.data[0]["operacion"]}]`).click();

      this.register.door=this.data[0]["cuartos"]
      $(`input:radio[name="door"][value=${this.data[0]["cuartos"]}]`).click();

      this.register.bano=this.data[0]["bano"]
      $(`input:radio[name="bano"][value=${this.data[0]["bano"]}]`).click();

      this.register.cochera=this.data[0]["cochera"]
      $(`input:radio[name="cochera"][value=${this.data[0]["cochera"]}]`).click();

      this.register.vista=this.data[0]["vista"]
      $(`input:radio[name="vista"][value=${this.data[0]["vista"]}]`).click();

      this.register.tipo=this.data[0]["tipo_depa"]
      $(`input:radio[name="tipo"][value=${this.data[0]["tipo_depa"]}]`).click();

      this.register.amoblado=this.data[0]["amoblado"]
      $(`input:radio[name="amoblado"][value=${this.data[0]["amoblado"]}]`).click();

      this.register.estreno=this.data[0]["estreno"]
      $(`input:radio[name="estreno"][value=${this.data[0]["estreno"]}]`).click();

      this.register.proyecto=this.data[0]["proyecto"]
      $(`input:radio[name="proyecto"][value=${this.data[0]["proyecto"]}]`).click();

      this.register.area=this.data[0]["area"]

      this.register.pre_type=this.data[0]["presupuesto"]["moneda"]

      this.register.pre_price=this.data[0]["presupuesto"]["precio"]

      this.register.man_type=this.data[0]["mantenimiento"]["moneda"]

      this.register.man_price=this.data[0]["mantenimiento"]["precio"]



        this.register.departamento=this.data[0]["coddireccion"].substr(0,2)

        this.listarProvincias(this.register.departamento);



        this.register.provincia=this.data[0]["coddireccion"].substr(2,2)


        this.listarDistritos(this.data[0]["coddireccion"].substr(0,4))

        this.register.distrito=this.data[0]["coddireccion"].substr(4,2)

        this.register.direccion=this.data[0]["direccion"]

        this.latitude = this.data[0]["latitud"]
        this.longitude = this.data[0]["longitud"]

        this.latitude_m = this.data[0]["latitud"]
        this.longitude_m = this.data[0]["longitud"]

        this.zoom=15;

        this.register.latitud=this.latitude
        this.register.longitud=this.longitude


      if(this.data[0]["adicionales"]["terraza"]){
        $(`input:checkbox[name="terraza"]`).prop('checked',true)
        $(`input:checkbox[name="terraza"]`).parent().addClass("pintar");
        this.register.terraza=this.data[0]["adicionales"]["terraza"]
        }else{
        $(`input:checkbox[name="terraza"]`).prop('checked',false)
        $(`input:checkbox[name="terraza"]`).parent().removeClass("pintar");
        this.register.terraza=false
        }



      if(this.data[0]["adicionales"]["mascota"]){
        $(`input:checkbox[name="mascota"]`).prop('checked',true)
        $(`input:checkbox[name="mascota"]`).parent().addClass("pintar");
        this.register.mascota=this.data[0]["adicionales"]["mascota"]
        }else{
        $(`input:checkbox[name="mascota"]`).prop('checked',false)

        $(`input:checkbox[name="mascota"]`).parent().removeClass("pintar");
        this.register.mascota=false
        }

        if(this.data[0]["adicionales"]["deposito"]){

        $(`input:checkbox[name="deposito"]`).prop('checked',true)
        $(`input:checkbox[name="deposito"]`).parent().addClass("pintar");
          this.register.deposito=this.data[0]["adicionales"]["deposito"]
          }else{
            $(`input:checkbox[name="deposito"]`).prop('checked',false)

        $(`input:checkbox[name="deposito"]`).parent().removeClass("pintar");
          this.register.deposito=false
          }

          if(this.data[0]["adicionales"]["ascensor"]){

        $(`input:checkbox[name="ascensor"]`).prop('checked',true)
        $(`input:checkbox[name="ascensor"]`).parent().addClass("pintar");
            this.register.ascensor=this.data[0]["adicionales"]["ascensor"]
            }else{

        $(`input:checkbox[name="ascensor"]`).prop('checked',false)

        $(`input:checkbox[name="ascensor"]`).parent().removeClass("pintar");
            this.register.ascensor=false
            }

            if(this.data[0]["adicionales"]["vigilancia"]){

        $(`input:checkbox[name="vigilancia"]`).prop('checked',true)
        $(`input:checkbox[name="vigilancia"]`).parent().addClass("pintar");
              this.register.vigilancia=this.data[0]["adicionales"]["vigilancia"]
              }else{
                $(`input:checkbox[name="vigilancia"]`).prop('checked',false)
                $(`input:checkbox[name="vigilancia"]`).parent().removeClass("pintar");
              this.register.vigilancia=false
              }

              if(this.data[0]["adicionales"]["servicio"]){

        $(`input:checkbox[name="servicio"]`).prop('checked',true)
        $(`input:checkbox[name="servicio"]`).parent().addClass("pintar");
                this.register.servicio=this.data[0]["adicionales"]["servicio"]
                }else{

        $(`input:checkbox[name="servicio"]`).prop('checked',false)

        $(`input:checkbox[name="servicio"]`).parent().removeClass("pintar");
                this.register.servicio=false
                }

                if(this.data[0]["adicionales"]["dscp"]){

        $(`input:checkbox[name="dscp"]`).prop('checked',true)
        $(`input:checkbox[name="dscp"]`).parent().addClass("pintar");
                  this.register.dscp=this.data[0]["adicionales"]["dscp"]
                  }else{

        $(`input:checkbox[name="dscp"]`).prop('checked',false)

        $(`input:checkbox[name="dscp"]`).parent().removeClass("pintar");
                  this.register.dscp=false
                  }

                  if(this.data[0]["adicionales"]["reunion"]){

        $(`input:checkbox[name="reunion"]`).prop('checked',true)
        $(`input:checkbox[name="reunion"]`).parent().addClass("pintar");
                    this.register.reunion=this.data[0]["adicionales"]["reunion"]
                    }else{

        $(`input:checkbox[name="reunion"]`).prop('checked',false)

        $(`input:checkbox[name="reunion"]`).parent().removeClass("pintar");
                    this.register.reunion=false
                    }

                    if(this.data[0]["adicionales"]["piscina"]){

        $(`input:checkbox[name="piscina"]`).prop('checked',true)
        $(`input:checkbox[name="piscina"]`).parent().addClass("pintar");
                      this.register.piscina=this.data[0]["adicionales"]["piscina"]
                      }else{

        $(`input:checkbox[name="piscina"]`).prop('checked',false)
        $(`input:checkbox[name="piscina"]`).parent().removeClass("pintar");
                      this.register.piscina=false
                      }


                      if(this.data[0]["adicionales"]["gym"]){

        $(`input:checkbox[name="gym"]`).prop('checked',true)
        $(`input:checkbox[name="gym"]`).parent().addClass("pintar");
                        this.register.gym=this.data[0]["adicionales"]["gym"]
                        }else{

        $(`input:checkbox[name="gym"]`).prop('checked',false)

        $(`input:checkbox[name="gym"]`).parent().removeClass("pintar");
                        this.register.gym=false
                        }

                        if(this.data[0]["adicionales"]["parrilla"]){

        $(`input:checkbox[name="parrilla"]`).prop('checked',true)
        $(`input:checkbox[name="parrilla"]`).parent().addClass("pintar");
                          this.register.parrilla=this.data[0]["adicionales"]["parrilla"]
                          }else{

        $(`input:checkbox[name="parrilla"]`).prop('checked',false)

        $(`input:checkbox[name="parrilla"]`).parent().removeClass("pintar");
                          this.register.parrilla=false
                          }

                          if(this.data[0]["adicionales"]["juego"]){

        $(`input:checkbox[name="juego"]`).prop('checked',true)
        $(`input:checkbox[name="juego"]`).parent().addClass("pintar");
                            this.register.juego=this.data[0]["adicionales"]["juego"]
                            }else{

        $(`input:checkbox[name="juego"]`).prop('checked',false)

        $(`input:checkbox[name="juego"]`).parent().removeClass("pintar");
                            this.register.juego=false
                            }

                            this.urlsdb=[];

        for (let index = 0; index < this.data[0]["image"].length; index++) {

           this.urlsdb.push(this.data[0]["image"][index])

        }




      }
    })

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

              if(this.urlsdb.length+this.url.length<10){

                var reader = new FileReader();

                  reader.onload = (events:any) => {
                     this.url.push(events.target.result );
                  }



                  this.urlAddDB.push(event.target.files[i]);



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

  eliminarImagen(pos){
    event.stopPropagation();

    this.urlsDBeliminar.push(this.urlsdb[pos])
    this.urlsdb.splice(pos, 1);





  }

  eliminarImagen2(pos){
    event.stopPropagation();


    this.url.splice(pos, 1);
    this.urlAddDB.splice(pos, 1);




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

  changeExit(valor){

    this.register.type_apar=valor;



    if(valor == "OFICINA" || valor == "TERRENO" ){

      $('input:radio[name="operation"][value="ALQUILER"]').click();
      this.isvacacional=false;


    }else{

      this.isvacacional=true;

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
    /*this.register.departamento_=globals.DEPARTMENTS_DIRECTION[this.register.departamento].name;
    this.register.provincia_=globals.PROVINCE_DIRECTION[this.register.departamento+this.register.provincia].name;*/
    this.register.distrito_=this.register.departamento+this.register.provincia+this.register.distrito
    this.register.id = this.id_inmueble;

    this.register.image=this.urlsdb;

  if(this.register.latitud== 0 || this.register.longitud==0){
    this.spinner.hide();
    this.toastr.warning('Debe buscar una direccion' );

    return false;
  }

  if(this.urlsdb.length+this.url.length<3){
    this.spinner.hide();
    this.toastr.warning('Debe agregar un minimo de 3 fotos' );

    return false;
  }

  if(this.urlsDBeliminar.length>0){

    this.FirebaseService.deleteImageInmueble(this.urlsDBeliminar);

  }




    this.FirebaseService.edit_inmueble(this.register).then((res) =>{

      this.count = 0;

      this.total=this.urlAddDB.length

      if(this.total>0){

      for (const file of this.urlAddDB) {

        const path = `inmuebles/${this.register.id}/${file["name"]}`;
        const ref = this.afStorage.ref(path);
        const task = this.afStorage.upload(path, file);


        let id = this.afs.createId();

        task.snapshotChanges().pipe(

          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.downloadURL = url;



              this.urlsdb.push({
                url:this.downloadURL,
                name:file["name"],
                id_image:id,
                id_inmueble:this.register.id

              })



              this.FirebaseService.uploadFiles(this.register.id,this.urlsdb).then((res)=>{

              });


                this.count++;


              if(this.urlAddDB.length == this.count ){

              this.spinner.hide();
              $("#modal_ok").modal('show');


              this.urlsDBeliminar=[];
              this.url=[];
              this.urlAddDB=[];

              }




            })



          })
        ).subscribe()
}
    }else{

      this.spinner.hide();
      $("#modal_ok").modal('show');

      this.urlsDBeliminar=[];
      this.url=[];
      this.urlAddDB=[];

    }

      /*this.spinner.hide();
      $("#modal_ok").modal('show');*/

   })


  }else {

    $("#exampleModalCenter").modal('show');

  }



}



}



