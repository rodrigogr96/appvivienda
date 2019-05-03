import { Component, OnInit,NgZone,Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import {NgbDate, NgbCalendar,NgbDatepickerConfig,NgbDatepickerI18n,NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as globals from '../globals/globals';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { isUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';

declare var $ :any;

class RequestDepartment {
	id: string
	value: any
}

const WEEKDAYS_SHORT = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) { return WEEKDAYS_SHORT[weekday - 1]; }
  getMonthShortName(month: number) { return MONTHS[month - 1]; }
  getMonthFullName(month: number) { return MONTHS[month - 1]; }
  getDayAriaLabel(date: NgbDateStruct): string { return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`; }
}

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css'],
  providers: [
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian}
  ]
})
export class SolicitudComponent implements OnInit {

  public data:any=[];
  public user:any={};

  public register:any = {};
  public p: number;


  public isvacacional:boolean=true;
  public rangeDate:boolean=false;

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



  public hoveredDate: NgbDate;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public de:Date;
  public hasta:Date;

  public filtro:any;
  public filtroJSON:any;

  public ordenar:any;


  public count:any;
  public count0:any;


  public colors = ['red', 'blue','black'];

  constructor(
    private FirebaseService: FirebaseService,
    private router: Router,
    private ngZone: NgZone,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,private spinner: NgxSpinnerService,
    private toastr: ToastrService) {


    config.minDate = calendar.getToday();


    }

  ngOnInit() {



    this.filtroSolicitudes();

    this.ordenar="desc"
    this.getAllUser();
    this.getSolicitud(this.filtro);
    this.p=1;
    this.obtenerDepartamentos();
    this.changeCheckbox();

    this.fromDate = this.calendar.getToday();







  }

  f_or() {
   this.filtro["ordenar"]= this.ordenar

   console.log(this.filtro);

   this.getSolicitud(this.filtro);
}


  filtroSolicitudes(){


    this.filtro={
      ordenar:'desc',
      tipo_departamento:'',
      operacion:'',
      distrito:'',
      radio_distrito:'',
      cuartos:'',
      bano:'',
      cochera:'',
      moneda:'',
      presupuesto:'',
      area:'',
      vista:'',
      tipo_depa:'',
      amoblado:'',
      ascensor:'',
      deposito:'',
      dscp:'',
      gym:'',
      juego:'',
      mascota:'',
      parrilla:'',
      piscina:'',
      reunion:'',
      servicio:'',
      terraza:'',
      vigilancia:'',
      estreno:'',
      proyecto:'',
      de:'',
      hasta:''
    }

  }

  changeCheckbox(){

    $(".chb").click(function(){
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



  getSolicitud(filtro){

    this.spinner.show();

    this.FirebaseService.getSolicitudesAll(filtro).subscribe((res) => {

    if(res.length>0){



      this.count=true;
      this.count0=false;

      this.data=res;

      if(filtro["ordenar"]=="desc"){

      this.data.sort((val1, val2)=> {return <any>new Date(val2.fecha.toDate()) -  <any>new
        Date(val1.fecha.toDate())})

      }else{

        this.data.sort((val1, val2)=> {return <any>new Date(val1.fecha.toDate()) -  <any>new
          Date(val2.fecha.toDate())})
      }

      if(filtro["area"]!=""){
       if(!isUndefined(filtro["area"])){
this.data = this.data.filter(elem => elem.area >= filtro["area"]);
       }
      }

       if(filtro["presupuesto"]!=""){
        if(!isUndefined(filtro["presupuesto"])){
 this.data = this.data.filter(elem => elem.presupuesto.precio <= filtro["presupuesto"]);
        }
      }

      if(filtro["operacion"]!=""){
        if(!isUndefined(filtro["operacion"])){

          if(filtro["operacion"]=="VACACIONAL"){

            if(!isUndefined(filtro["de"]) || !isUndefined(filtro["hasta"])  ){

              this.data = this.data.filter(elem =>
                filtro["de"] >= elem.rango.de.toDate()
                 &&
                 filtro["hasta"] <= elem.rango.hasta.toDate()
                 );

            }


          }
        }
      }


      if(this.data.length==0){

      this.count0=true;
      this.count=false;

      }else{


      this.count0=false;
      this.count=true;
      }




    }else{

      this.count0=true;
      this.count=false;

    }

    this.spinner.hide();


  })

}



borrar(){
  this.filtro["ordenar"]='desc'
  this.filtro["terraza"]=''
  this.filtro["mascota"]=''
  this.filtro["deposito"]=''
  this.filtro["vigilancia"]=''
  this.filtro["servicio"]=''
  this.filtro["dscp"]=''
  this.filtro["reunion"]=''
  this.filtro["piscina"]=''
  this.filtro["gym"]=''
  this.filtro["parrilla"]=''
  this.filtro["juego"]=''
  this.filtro["ordenar"]='desc'
  this.filtro["tipo_departamento"]=''
  this.filtro["operacion"]=''
  this.filtro["distrito"]=''
  this.filtro["cuartos"]=''
  this.filtro["bano"]=''
  this.filtro["cochera"]=''
  this.filtro["presupuesto"]=''
  this.filtro["area"]=''
  this.filtro["vista"]=''
  this.filtro["tipo_depa"]=''
  this.filtro["amoblado"]=''
  this.filtro["estreno"]=''
  this.filtro["proyecto"]=''
  this.filtro["de"]=''
  this.filtro["hasta"]=''
  this.filtro["moneda"]=''

    this.ordenar='desc'
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
    this.register.distrito=""
    this.register.provincia=""
    this.register.departamento=""
    this.register.pre_type=""
    this.register.area = ""
    this.register.pre_price = ""
    this.de=undefined
    this.hasta=undefined

    this.rangeDate=false;

     $(".chb").removeClass("pintar");
     $(".ac").removeClass("active");

  this.getSolicitud(this.filtro);

}

buscar(){

  this.filtro["terraza"]=this.register.terraza;
  this.filtro["mascota"]=this.register.mascota;
  this.filtro["deposito"]=this.register.deposito;
  this.filtro["vigilancia"]=this.register.vigilancia;
  this.filtro["servicio"]=this.register.servicio;
  this.filtro["dscp"]=this.register.dscp;
  this.filtro["reunion"]=this.register.reunion;
  this.filtro["piscina"]=this.register.piscina;
  this.filtro["gym"]=this.register.gym;
  this.filtro["parrilla"]=this.register.parrilla;
  this.filtro["juego"]=this.register.juego;
  this.filtro["moneda"]=this.register.pre_type;
  this.filtro["area"]=this.register.area;
  this.filtro["presupuesto"]=this.register.pre_price;
  this.filtro["de"]=this.de;
  this.filtro["hasta"]=this.hasta;




  this.getSolicitud(this.filtro);


}


onlyNumber(event) {
  const pattern = /[0-9]/;
  let inputChar = String.fromCharCode(event.charCode);

  if (!pattern.test(inputChar)) {
      event.preventDefault();
  }
}



getAllUser(){



  this.FirebaseService.getallUser().subscribe((res) => {
   let name = "";

      for (let index = 0; index < res.length; index++) {

        name = res[index]["name"].split(" ");
        this.user[res[index]["id"]]=name[0].toUpperCase();

      }

      localStorage.setItem("users",  JSON.stringify(this.user));



  });


}

changeVacacional(valor){

  this.register.operation=valor;

  this.filtro["operacion"]= valor

  if(valor == "VACACIONAL"){

    this.rangeDate=true;

    $(".ngb-dp-months ").addClass("display-block");

  }else{

    this.filtro["de"]=''
    this.filtro["hasta"]=''
    this.de=undefined
    this.hasta=undefined

    this.rangeDate=false;

  }


}

changeExit(valor){

  this.register.type_apar=valor;

  this.filtro["tipo_departamento"]= valor



  if(valor == "OFICINA" || valor == "TERRENO" ){


    this.isvacacional=false;
    this.changeVacacional('ALQUILER');

    $('input:radio[name="operation"][value="ALQUILER"]').click();


  }else{

    this.isvacacional=true;

  }


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
  this.districSeleccionado = this.selectDistric.text;
  /*let distrito = globals.DISTRICT_DIRECTION[this.register.departamento+this.register.provincia+this.register.distrito].name;*/
  let distrito = this.register.departamento+this.register.provincia+this.register.distrito
  this.filtro["distrito"]= distrito
}


setDistrito(cod){
  let distrito = globals.DISTRICT_DIRECTION[cod].name
  return distrito
}



onDateSelection(date: NgbDate) {
  if (!this.fromDate && !this.toDate) {
    this.fromDate = date;
  } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
    this.toDate = date;
    this.de =new Date(this.fromDate.year,this.fromDate.month-1,this.fromDate.day);
    this.hasta =new Date(this.toDate.year,this.toDate.month-1,this.toDate.day);
    console.log(this.de,this.hasta);
  } else {
    this.toDate = null;
    this.fromDate = date;
  }
}

isHovered(date: NgbDate) {
  return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
}

isInside(date: NgbDate) {
  return date.after(this.fromDate) && date.before(this.toDate);
}

isRange(date: NgbDate) {
  return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
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

}
