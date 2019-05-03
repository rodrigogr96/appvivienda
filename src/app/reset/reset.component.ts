import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
declare var $ :any;
import { NgForm } from '@angular/forms';
import { FirebaseService } from '../servicios/firebase.service';
import { empty } from 'rxjs';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {


constructor( private authService: AuthService, private FirebaseService: FirebaseService) { }

public reset: any = {};
public error:any={};


public message_c_valid:boolean = false;
public message_text: String = null;



  ngOnInit() {

    $("#exampleModalCenter").hide();
    $(".modal-backdrop").hide();

  }




  resetPasswordEmail(form: NgForm): void {

    this.FirebaseService.getUserByEmail(this.reset.email).subscribe(success => {

      if(success.length>0){
        if(success[0]["provider"]=="password"){

          this.authService.resetPassword(this.reset.email).then((res) => {

            this.message_c_valid= true,
            this.error.message="success",
            this.message_text = "Verficar correo electronico.",
            form.reset();

          }).catch(
            err => {

              this.message_c_valid= true;

              this.error.message="error";

              switch (err.message) {
                case "The email address is badly formatted.":
                  this.message_text="La dirección de correo electrónico está mal formateada.";
                  break;
                case "There is no user record corresponding to this identifier. The user may have been deleted.":
                  this.message_text="No existe correo electrónico.";
                    break;
                case 'sendPasswordResetEmail failed: First argument "email" must be a valid string.':
                  this.message_text="Ingresar correo electrónico.";
                  break
                default:
                this.message_text="Error.";
              }


            });

        }else{

        this.message_c_valid= true;
        this.error.message="error";
        this.message_text="Se registro por Fb, no puede acceder a la opcion de cambiar contraseña.";


        }
      }else{
        this.message_c_valid= true;
        this.error.message="error";
        this.message_text="No existe correo electrónico.";
      }

      setTimeout(()=>{
        this.message_c_valid = false;
        this.error.message = "";
        }, 5000);


    });

}

}
