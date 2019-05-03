import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { AngularFirestore, AngularFirestoreDocument,AngularFirestoreCollection} from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';

import * as globals from '../globals/globals';

@Component({
  selector: 'app-inmueble',
  templateUrl: './inmueble.component.html',
  styleUrls: ['./inmueble.component.css']
})
export class InmuebleComponent implements OnInit {
  public data:any=[];
  public user:any={};



  public colors = ['red', 'blue','black'];


  constructor(private router: Router,
    private FirebaseService: FirebaseService,
    private afs: AngularFirestore,private spinner: NgxSpinnerService) {
  }

  ngOnInit() {

    this.getAllUser();
    this.getSolicitud();


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


  redireccionar(href):void{

    this.router.navigate([href]);
  }

  getSolicitud(){

    this.spinner.show();

    this.FirebaseService.getSolicitudesHome().subscribe((res) => {

     this.data=res;



  })
}

setDistrito(cod){
  let distrito = globals.DISTRICT_DIRECTION[cod].name
  return distrito
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


