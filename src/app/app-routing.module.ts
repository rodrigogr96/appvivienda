import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InmuebleComponent } from './inmueble/inmueble.component';
import { VehiculoComponent } from './vehiculo/vehiculo.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ResetComponent } from './reset/reset.component';
import { RegisterInmuebleComponent } from './register-inmueble/register-inmueble.component';
import { RegisterSolicitudComponent } from './register-solicitud/register-solicitud.component';
import { EditSolicitudComponent } from './edit-solicitud/edit-solicitud.component';
import { EditInmuebleComponent } from './edit-inmueble/edit-inmueble.component';
import { AuthGuard } from './observador/auth.guard';
import { SolicitudComponent } from './solicitud/solicitud.component';
import {DetailSolicitudComponent} from './detail-solicitud/detail-solicitud.component';
import {DetailInmuebleComponent} from './detail-inmueble/detail-inmueble.component';
import { TermComponent } from './term/term.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { ProfileComponent } from './profile/profile.component';

const app_routes: Routes = [
  {path: 'home', component: InmuebleComponent},
  {path: 'vehiculo', component: VehiculoComponent},
  {path: 'reset', component: ResetComponent},
  {path: 'registro-inmueble', component: RegisterInmuebleComponent},
  {path: 'registro-solicitud', component: RegisterSolicitudComponent},
  {path: 'perfil', component: ProfileComponent,canActivate: [AuthGuard]},
  {path: 'editar-solicitud/:id', component: EditSolicitudComponent,canActivate: [AuthGuard]},
  {path: 'editar-inmueble/:id', component: EditInmuebleComponent,canActivate: [AuthGuard]},
  {path: 'search', component: SolicitudComponent},
  {path: 'detalle-solicitud/:id', component: DetailSolicitudComponent},
  {path: 'detalle-inmueble/:id', component: DetailInmuebleComponent},
  {path: 'terminos-condiciones', component: TermComponent},
  {path: 'politicas-privacidad', component: PoliticasComponent},
  {path: '**', redirectTo: 'home',pathMatch: 'full' }
]

@NgModule({
  imports: [
      RouterModule.forRoot( app_routes, { useHash: false } )
  ],
  exports: [
      RouterModule
  ]
})

export class AppRoutingModule { }
