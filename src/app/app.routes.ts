import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { DashboardHomeComponent } from './admin/inicio/dashboard-home/dashboard-home.component';
import { ListaCatComponent } from './admin/categoria/lista-cat/lista-cat.component';
import { ListaPedComponent } from './admin/pedido/lista-ped/lista-ped.component';
import { ListaDirecComponent } from './admin/direccion/lista-direc/lista-direc.component';
import { ListaDocComponent } from './admin/documento/lista-doc/lista-doc.component';
import { ListaProducComponent } from './admin/producto/lista-produc/lista-produc.component';
import { HomeComponent } from './cliente/home/home.component';
import { SobreNosotrosComponent } from './cliente/sobre-nosotros/sobre-nosotros.component';
import { ContactoComponent } from './cliente/contacto/contacto.component';
import { ListaContComponent } from './admin/contacto/lista-cont/lista-cont.component';
import { ProductoComponent } from './cliente/producto/producto.component';


export const routes: Routes = [
  // Ruta inicial redirige a login
  { path: '', component: HomeComponent },
  // { path: '', redirectTo: 'login', pathMatch: 'full'},
  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'producto', component: ProductoComponent },

  // Rutas para ADMIN
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: DashboardHomeComponent },
      { path: 'listar-categoria', component: ListaCatComponent },
      { path: 'listar-pedido', component: ListaPedComponent },
      { path: 'listar-direccion', component: ListaDirecComponent },
      { path: 'listar-documentos', component: ListaDocComponent},
      { path: 'listar-producto', component: ListaProducComponent},
      { path: 'listar-mensajes', component: ListaContComponent}
    ]
  },

  

];
