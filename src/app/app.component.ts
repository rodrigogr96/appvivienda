import { Component, OnInit } from '@angular/core';
import { FirebaseService } from './servicios/firebase.service';
import { AuthService } from './servicios/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']


})
export class AppComponent implements OnInit {


  title = 'yoBusco';
  public id_usuario:string;
  public isLogged: boolean = false;

  public items: Observable<any[]>;

  array:any

  count:any

  constructor(
    private FirebaseService: FirebaseService,
    private authService: AuthService,
    private afs : AngularFirestore
    ) { }


    ngOnInit() {

      /*this.authService.isAuth().subscribe(auth => {
        if (auth) {
          this.isLogged = true;

          this.id_usuario=auth.uid;

          this.items =this.afs.collection(`solicitudes`, ref => ref.where("id_user", '==', this.id_usuario , ) ).snapshotChanges(["modified"]);

           this.items.pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data().match ;
              console.log(data);


              return {data};
            }))
          ).subscribe((res)=>{

            console.log(res);


          })

          console.log(this.id_usuario);


        }else {

          this.isLogged = false;
          this.id_usuario="error";

          console.log(this.id_usuario);


        }
      });*/

    }
}
