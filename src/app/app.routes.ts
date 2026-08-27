import { Routes } from '@angular/router';
import { FormularioComponent } from './componentes/formulario/formulario';

export const routes: Routes = [
  { path: '', redirectTo: 'formulario', pathMatch: 'full' },
  { path: 'formulario', component: FormularioComponent }
];