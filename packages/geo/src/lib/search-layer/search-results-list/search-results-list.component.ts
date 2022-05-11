import { Component, OnInit, Input } from '@angular/core';
import { SearchFocusedComponent } from '../search-focused/search-focused.component'
import { SearchLayerUiService } from "../../search-layer/services/search-layer-ui.service"
import { SearchLayerService } from "../../search-layer/services/search-layer.service"
import * as layersInfo from '../assets/search-layer.json';
import { FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'igo-search-results-list',
  templateUrl: './search-results-list.component.html',
  styleUrls: ['./search-results-list.component.scss']
})
export class SearchResultsListComponent implements OnInit {

  @Input() searchResults: any;
  @Input() layerName: any;

  public searchResultsListLabels;
  public focusResultField;

  constructor(
    private searchLayerService: SearchLayerService,
    private searchLayerUiService: SearchLayerUiService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.searchResultsListLabels = layersInfo[this.layerName]['searchResultsList']
    this.focusResultField = layersInfo[this.layerName]["focusResultField"]

    this.searchLayerUiService.dismissLoading()
  }

  public lastPage(){
    this.searchLayerUiService.closeModal()
  }

  public hideSearch(){
    this.searchLayerUiService.dissmissModals()
  }

  public focusResults(focusedResult : any){

    this.searchLayerUiService.showLoading()

    let options = {}
    if (this.layerName === "RoleEvaluation") {
      options["table"] = "Role"
    }

    let searchFormPrototype = {}
    searchFormPrototype[this.focusResultField] = [focusedResult['properties'][this.focusResultField], Validators.required]
    const searchForm = this.formBuilder.group(
      searchFormPrototype
    )
    
    this.searchLayerService.focusedSearch(searchForm, this.layerName, options, SearchFocusedComponent)
  }

}
