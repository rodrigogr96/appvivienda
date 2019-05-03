import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { FirebaseService } from '../servicios/firebase.service';
import { NgForm } from '@angular/forms';

declare var $ :any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthService , private FirebaseService: FirebaseService) { }

public login:any = {};
public register:any={};


/*USUARIO*/

public nameUser: string=null;
public isLogged: boolean = false;

/*ERRORES*/
public _message_login: boolean = false;
public message_text_login: String = "";
public _message_register: boolean = false;
public message_text_register: String = "";


  ngOnInit() {

    this.getCurrentUser();
  }


  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {

          this.isLogged = true;

          this.FirebaseService.getUserById(auth.uid).subscribe((res) => {
            this.nameUser=res['name'];
          })

      }else{
        this.isLogged = false;
      }

    });
  }



  onAddUser(form: NgForm): void {
      this.authService.registerUser(this.register.emailr, this.register.password,this.register.nombre,this.register.apellido)
      .then((res) => {
        this.authService.isAuth().subscribe(user => {
          if (user) {
              user.updateProfile({
              displayName: this.register.nombre,
              photoURL: "assets/img/foto_perfil.jpg"
            }).then((res) => {

              $("#exampleModalCenter").hide();
              $(".modal-backdrop").hide();
              form.reset();

            }).catch((err) => console.log(err.message));
          }
        });
      }).catch(err => {

        this._message_register = true;
        switch (err.message) {
          case 'createUserWithEmailAndPassword failed: Second argument "password" must be a valid string.':
            this.message_text_register="La contraseña debe tener al menos 6 caracteres";
            break;
          case "The email address is already in use by another account.":
            this.message_text_register="La dirección de correo electrónico ya está en uso por otra cuenta.";
            break;
          case "Password should be at least 6 characters":
            this.message_text_register="La contraseña debe tener al menos 6 caracteres";
            break;
          case "The email address is badly formatted.":
            this.message_text_register="La dirección de correo electrónico está mal formateada.";
              break;
          default:
          this.message_text_register="Error generico";
        }

        setTimeout(()=>{
          this._message_register = false;
          this.message_text_register = "";
          }, 5000);

      });
  }





  onLogin(form: NgForm): void {
    this.authService.loginEmailUser(this.login.email, this.login.passwordr)
      .then((res) => {

       $("#exampleModalCenter").hide();
       $(".modal-backdrop").hide();
       form.reset();

      }).catch(
        err => {
           console.log(err.message);
          this._message_login = true;

          switch (err.message) {
            case "The password is invalid or the user does not have a password.":
              this.message_text_login="Correo electrónico y/o contraseña incorrectos.";
              break;
            case "The email address is badly formatted.":
              this.message_text_login="La dirección de correo electrónico está mal formateada.";
              break;
            case "The user account has been disabled by an administrator.":
              this.message_text_login="La cuenta de usuario ha sido desactivada por un administrador.";
                break;
            case "There is no user record corresponding to this identifier. The user may have been deleted.":
              this.message_text_login="Correo electrónico y/o contraseña incorrectos.";
                break;
            default:
            this.message_text_login="Error generico";
          }

          setTimeout(()=>{
            this._message_login = false;
            this.message_text_login = "";
            }, 5000);


        });
  }



  onLoginFacebook(): void {
    this.authService.loginFacebookUser().then(
      (success) => {

      $("#exampleModalCenter").hide();
      $(".modal-backdrop").hide();

      }
    ).catch(err => {
        console.log(err.message);
       });
  }


  onLogout() {
    this.authService.logoutUser();
    this.router.navigate(['home']);
  }



}
