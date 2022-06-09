import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav'
import { IgoMapModule } from "../map/map.module"

import { SearchParametersComponent } from "./search-parameters/search-parameters.component";
import { SearchResultsListComponent } from './search-results-list/search-results-list.component';
import { SearchFocusedComponent } from './search-focused/search-focused.component'

import { SearchLayerService } from "./services/search-layer.service"
import { SearchLayerUiService } from "./services/search-layer-ui.service"
import { SearchRoleService } from "./services/RoleEvaluation/search-role.service"
import { SearchBauxService } from "./services/Baux/search-baux.service"

import { RoleEnvironment } from "./services/RoleEvaluation/roleEnvironment"
import { BauxEnvironment } from "./services/Baux/bauxEnvironment"

@NgModule({
  declarations: [
    SearchParametersComponent,
    SearchResultsListComponent,
    SearchFocusedComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSidenavModule,
    IgoMapModule
  ],
  exports: [
    SearchResultsListComponent,
    SearchFocusedComponent
  ],
  providers: [
    SearchRoleService,
    SearchBauxService,
    SearchLayerService,
    SearchLayerUiService
  ]
})
export class SearchLayerModule {
  static forRoot(roleEnvironment: RoleEnvironment, bauxEnvironment: BauxEnvironment): ModuleWithProviders<any> {
    return {
      ngModule: SearchLayerModule,
      providers: [
        SearchRoleService,
        {provide: RoleEnvironment, useValue: roleEnvironment},
        SearchBauxService,
        {provide: BauxEnvironment, useValue: bauxEnvironment}
      ]
    }
  }
}
