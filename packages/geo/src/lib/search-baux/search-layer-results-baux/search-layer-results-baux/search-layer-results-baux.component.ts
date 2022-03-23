import { Component, OnInit, Input } from '@angular/core';
import { SearchFocusedBauxComponent } from '../..';
import { SearchBauxUiService } from '../..';
import { SearchBauxService } from '../..';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'

@Component({
  selector: 'igo-search-layer-results-baux',
  templateUrl: './search-layer-results-baux.component.html',
  styleUrls: ['./search-layer-results-baux.component.scss']
})
export class SearchLayerResultsBauxComponent implements OnInit {

  @Input() searchResults: any;
  @Input() client: any;

  public title: String = "Baux";

  constructor(
    private searchBauxUiService:SearchBauxUiService,
    private searchBauxService: SearchBauxService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
  }

  public lastPage(){
    this.searchBauxUiService.closeModal()
  }

  public hideSearch(){
    this.searchBauxUiService.dissmissModals()
  }

  public focusResults(newFocusedResult : any){
    const searchFields = { 'criteria1' : 'CODE' }
    const searchForm = this.formBuilder.group({
      'criteria1': [newFocusedResult['properties']['CODE'].toString(), Validators.required]
    })
    this.searchBauxService.searchTableAndPresent('PROPRIO', searchFields, searchForm, SearchFocusedBauxComponent)
  }
}
