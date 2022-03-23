import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav'
import { IgoMapModule } from '../map/map.module'

import { SearchParametersBauxComponent } from './search-parameters-baux/search-parameters-baux/search-parameters-baux.component';
import { SearchLayerResultsBauxComponent } from './search-layer-results-baux/search-layer-results-baux/search-layer-results-baux.component';
import { SearchFocusedBauxComponent } from './search-focused-baux/search-focused-baux/search-focused-baux.component';
import { SearchBauxResultsComponent } from './search-baux-results/search-baux-results/search-baux-results.component';

import { SearchBauxService } from './services/search-baux.service';

import { BauxEnvironment } from './bauxEnvironment';

@NgModule({
  declarations: [
    SearchParametersBauxComponent,
    SearchLayerResultsBauxComponent,
    SearchFocusedBauxComponent,
    SearchBauxResultsComponent
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
    SearchLayerResultsBauxComponent,
    SearchFocusedBauxComponent
  ],
  providers: [
    SearchBauxService
  ]
})
export class SearchBauxModule { 
  static forRoot(bauxEnvironment: BauxEnvironment): ModuleWithProviders<any> {
    return {
      ngModule: SearchBauxModule,
      providers: [
        SearchBauxService,
        { provide: BauxEnvironment, useValue: bauxEnvironment }
      ]
    };
  }
}