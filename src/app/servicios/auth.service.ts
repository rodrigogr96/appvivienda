import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { auth, User } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { UserInterface } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afsAuth: AngularFireAuth, private afs: AngularFirestore) { }

  registerUser(email: string, pass: string,name:String,apellido:String) {
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.createUserWithEmailAndPassword(email, pass)
        .then(userData => {
          resolve(userData),
          this.updateUserDataCorreo(userData.user,userData.additionalUserInfo["isNewUser"],name,apellido)
        }).catch(
          err => reject(err)
          )
    });
  }


  loginEmailUser(email: string, pass: string) {
    return new Promise((resolve, reject) => {
      this.afsAuth.auth.signInWithEmailAndPassword(email, pass)
        .then(userData => resolve(userData),
        err => reject(err));
    });
  }

  loginFacebookUser() {
      return this.afsAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
      .then(credential =>
        this.updateUserData(credential.user,credential.additionalUserInfo["isNewUser"])
        )

  }

  logoutUser() {
    return this.afsAuth.auth.signOut();
  }


  isAuth() {
    return this.afsAuth.authState.pipe(map(auth => auth));
  }

  resetPassword(email: string) {
    return this.afsAuth.auth.sendPasswordResetEmail(email);
  }



  private updateUserData(user,userinfo) {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: UserInterface = {
      name:user.displayName,
      email:user.email,
      photoUrl:user.photoURL,
      telefono:null,
      provider:user.providerData[0].providerId,
      id:user.uid,
      apellido:null
    }

    if(userinfo){

    return userRef.set(data, { merge: true });

    }else{

    }

    }

    private updateUserDataCorreo(user,userinfo,nombre,apellido) {

      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

      const data: UserInterface = {
        name:nombre,
        apellido:apellido,
        email:user.email,
        photoUrl:"assets/img/foto_perfil.jpg",
        telefono:null,
        provider:user.providerData[0].providerId,
        id:user.uid
      }

      if(userinfo){

      return userRef.set(data);

      }else{


      }

      }





    }






