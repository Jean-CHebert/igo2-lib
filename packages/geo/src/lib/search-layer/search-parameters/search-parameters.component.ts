import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms'
import * as layersInfo from '../assets/search-layer.json';
import { SearchLayerService } from '../services/search-layer.service';
import { SearchLayerUiService } from '../services/search-layer-ui.service';
import { SearchResultsListComponent } from "../search-results-list/search-results-list.component"

@Component({
  selector: 'igo-search-parameters',
  templateUrl: './search-parameters.component.html',
  styleUrls: ['./search-parameters.component.scss']
})
export class SearchParametersComponent implements OnInit {

  @Input() layerName: string;

  public databaseToScreen = {};
  public searchForms : any = {};
  public searchableFields : any = {};
  public searchType: string;
  public searchableTabs = []
  public extendedSearch = false

  constructor(private formBuilder: FormBuilder,
    private searchLayerUiService:SearchLayerUiService,
    private searchLayerService: SearchLayerService) { 

  }

  ngOnInit(): void {

    this.databaseToScreen = layersInfo[this.layerName]['databaseToScreen']

    this.searchableTabs = Object.keys(layersInfo[this.layerName]['searchTab'])

    for (let searchTab of Object.keys(layersInfo[this.layerName]['searchTab'])) {
      this.searchForms[searchTab] = this.formBuilder.group({})
      this.searchForms[searchTab].addControl(layersInfo[this.layerName]['searchTab'][searchTab][0], new FormControl('', Validators.required))
      this.searchableFields[searchTab] = JSON.parse(JSON.stringify(layersInfo[this.layerName]['searchTab'][searchTab]))
      this.searchableFields[searchTab].splice(0,1)
    }

    this.searchType = this.searchableTabs[0]
  }

  public switchSearchTab(newTab: string) {
    this.searchType = newTab
  }

  public fillButton(searchTab: string) {
    if (this.searchType === searchTab) {
      return "solid"
    }
    return "outline"
  }

  public addSearchField(){
      this.searchForms[this.searchType].addControl(this.searchableFields[this.searchType][0], new FormControl('', Validators.required));
      this.searchableFields[this.searchType].splice(0,1)
  }

  public removeSearchField(control : any){
      this.searchableFields[this.searchType].push(control.key)
      this.searchForms[this.searchType].removeControl(control.key)
  }

  public maxSearchFields() {
    return this.searchableFields[this.searchType].length === 0
  }

  public setSearchField($event, control : any){
    if ($event.target.value){
        this.removeSearchField(control)
        this.searchForms[this.searchType].addControl($event.target.value, new FormControl('', Validators.required));
        const index = this.searchableFields[this.searchType].indexOf($event.target.value)
        this.searchableFields[this.searchType].splice(index,1)
    }
  }

  public lastPage(){
    this.searchLayerUiService.closeModal()
  }

  public hideSearch(){
    this.searchLayerUiService.dissmissModals()
  }

  public toggleExtendedSearch() {
    this.extendedSearch = !this.extendedSearch
  }

  public presentInfoAlert() {
    this.searchLayerUiService.presentInfoAlert()
  }

  public searchLayer(){
    let nonEmptySearch = false
    for (let key of Object.keys(this.searchForms[this.searchType]["value"])) {
      if (this.searchForms[this.searchType]["value"][key]) {
        nonEmptySearch = true
      }
    }

    if (nonEmptySearch){
      this.searchLayerUiService.showLoading()
      this.searchLayerService.searchLayer(this.searchForms[this.searchType], this.layerName, this.searchOptions(), SearchResultsListComponent)
    }
    else {
      this.searchLayerUiService.presentAlert("Recherche vide", "", "Veuillez entrer au moins un critère de recherche")
    }
  }

  public searchOptions() {

    let options = {
      "table": this.searchType,
      "extended": this.extendedSearch
    }

    return options
  }
  
}
