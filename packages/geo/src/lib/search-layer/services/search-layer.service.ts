import { Injectable } from '@angular/core';
import { SearchRoleService } from "./RoleEvaluation/search-role.service"
import { SearchBauxService } from "./Baux/search-baux.service"
import { SearchLayerUiService } from "./search-layer-ui.service"
import { resolve } from 'path';

@Injectable({
  providedIn: 'root'
})
export class SearchLayerService {

  private services = {}

  constructor(
    searchRoleService: SearchRoleService,
    searchBauxService: SearchBauxService,
    private searchLayerUiService: SearchLayerUiService
    ) {
      this.services["RoleEvaluation"] = searchRoleService
      this.services["Baux"] = searchBauxService
    }

  public searchLayer(searchForm, layerName, options, component) {
    this.services[layerName].searchLayer(searchForm, options).then(res => {
      if (res["features"].length === 0) {
        this.searchLayerUiService.dismissLoading()
        this.searchLayerUiService.presentAlert('Aucun résultat trouvé', '', 'Veuillez vérifier vos paramètres de recherches.')
      }
      else if (res["features"].length > 1000){
        this.searchLayerUiService.dismissLoading()
        this.searchLayerUiService.presentAlert('Trop de résultats', '', 'Veuillez affiner votre recherche')
      }
      else {
        this.searchLayerUiService.showSearchResultList(component, res['features'], layerName)
      }
    }).catch( () => {
      this.searchLayerUiService.dismissLoading()
      this.searchLayerUiService.presentAlert('Erreur', '', "Une erreur s'est produite. Veuillez vérifier votre connexion et réessayer.")
    })
  }

  public async searchLayerAndReturn(searchForm, layerName, options) {
    return await this.services[layerName].searchLayer(searchForm, options)
  }

  public focusedSearch(searchForm, layerName, options, component) {
    this.services[layerName].searchLayer(searchForm, options).then(res => {
      this.searchLayerUiService.showFocusedResult(component, res['features'], layerName)
    }).catch( () => {
      this.searchLayerUiService.dismissLoading()
      this.searchLayerUiService.presentAlert('Erreur', '', "Une erreur s'est produite. Veuillez vérifier votre connexion et réessayer.")
    })
  }

}
