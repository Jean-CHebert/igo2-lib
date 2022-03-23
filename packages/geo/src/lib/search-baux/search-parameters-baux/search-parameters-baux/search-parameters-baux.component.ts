import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import * as labelListTemp from '../../assets/search-layer.json';
import { SearchLayerResultsBauxComponent } from '../../search-layer-results-baux/search-layer-results-baux/search-layer-results-baux.component'
import { SearchBauxResultsComponent } from '../../search-baux-results/search-baux-results/search-baux-results.component'
import { SearchBauxUiService } from '../../services/search-baux-ui.service'
import { SearchBauxService } from '../../services/search-baux.service'

@Component({
  selector: 'igo-search-parameters-baux',
  templateUrl: './search-parameters-baux.component.html',
  styleUrls: ['./search-parameters-baux.component.scss']
})
export class SearchParametersBauxComponent implements OnInit {
  @Input() searchResults: any;
  @Input() client: any;

  public labelList : any;
  public searchForm : FormGroup;
  public searchFields : any;
  public searchFormCompany: FormGroup;
  public searchFieldsCompany;
  public searchFormPerson: FormGroup;
  public searchFieldsPerson : any;
  public title: String = "Baux";
  private criteriaCount : number;
  private criteriaCountCompany: number=1;
  private criteriaCountPerson: number=2;
  private searchableFields : any;
  private searchableFieldsCompany : any;
  private searchableFieldsPerson : any = ['NOM', 'PRENOM', 'CODE'];
  private loading: HTMLIonLoadingElement;
  public searchType: string = "Company";

  constructor(private formBuilder: FormBuilder,
    private searchBauxUiService:SearchBauxUiService,
    private searchBauxService: SearchBauxService) { 
    this.searchFormCompany = formBuilder.group({
      'criteria1': ['', Validators.required]
    })
    this.searchFormPerson = formBuilder.group({
      'criteria1': ['', Validators.required],
      'criteria2': ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.searchableFieldsCompany = this.searchResults;
    this.searchFieldsCompany = {
      'criteria1': 'TITULAIRE',
    }
    this.searchFieldsPerson = {
      'criteria1': 'NOM',
      'criteria2': 'PRENOM',
    }
    var index = this.searchableFieldsCompany.indexOf('TITULAIRE', 0)
    this.searchableFieldsCompany.splice(index,1)
    index = this.searchableFieldsPerson.indexOf('PRENOM', 0)
    this.searchableFieldsPerson.splice(index,1)
    index = this.searchableFieldsPerson.indexOf('NOM', 0)
    this.searchableFieldsPerson.splice(index,1)
    //this.searchableFieldsBaux.splice(0,1)
    this.labelList = labelListTemp;
    this.searchForm = this.searchFormCompany
    this.searchFields = this.searchFieldsCompany
    this.searchableFields = this.searchableFieldsCompany
    this.criteriaCount = this.criteriaCountCompany
  }

  public setSearchCompany(){
    if (this.searchType==="Person"){
      this.searchFormPerson = this.searchForm
      this.searchForm = this.searchFormCompany
      this.searchFieldsPerson = this.searchFields
      this.searchFields = this.searchFieldsCompany
      this.searchableFields = this.searchableFieldsCompany
      this.criteriaCountPerson = this.criteriaCount
      this.criteriaCount = this.criteriaCountCompany
      this.searchType = "Company"
    }
  }

  public setSearchPerson(){
    if (this.searchType==="Company"){
      this.searchFormCompany = this.searchForm
      this.searchForm = this.searchFormPerson
      this.searchFieldsCompany = this.searchFields
      this.searchFields = this.searchFieldsPerson
      this.searchableFields = this.searchableFieldsPerson
      this.criteriaCountCompany = this.criteriaCount
      this.criteriaCount = this.criteriaCountPerson
      this.searchType = "Person"
    }
  }

  public getSearchFields(){
    return this.searchableFields;
  }

  public addSearchField(){
      this.criteriaCount++;
      this.searchForm.addControl('criteria' + this.criteriaCount, new FormControl('', Validators.required));
      this.searchFields["criteria" + this.criteriaCount] = this.getSearchFields()[0];
      this.searchableFields.splice(0,1)
  }

  public removeSearchField(control : any){
      this.searchableFields.push(this.searchFields[control.key])
      this.searchForm.removeControl(control.key);
      delete this.searchFields[control.key];
  }

  public setSearchField($event, control : any){
    if ($event.target.value){
        this.searchableFields.push(this.searchFields[control.key])
        this.searchFields[control.key] = $event.target.value;
        const index = this.searchableFields.indexOf($event.target.value)
        this.searchableFields.splice(index,1)
    }
  }

  public getValue(controlKey : string){
    return this.searchFields[controlKey];
  }

  public maxCriterias(){
    return this.getSearchFields().length <= 0
  }

  public lastPage(){
    this.searchBauxUiService.closeModal()
  }

  public hideSearch(){
    this.searchBauxUiService.dissmissModals()
  }

  public fillType(buttonName : string){
    if (buttonName===this.searchType){
      return 'solid'
    }
    return 'outline'
  }

  public searchLayer(){
    if (this.verifyFormEmpty()){
      if (this.searchType==='Company'){
        this.searchBauxService.searchTableAndPresent('Company', this.searchFields, this.searchForm, SearchLayerResultsBauxComponent)
      }
      else {
        this.searchBauxService.searchTableAndPresent('Person', this.searchFields, this.searchForm, SearchLayerResultsBauxComponent)
      }
    }
    else {
      this.searchBauxService.presentAlert('Erreur', '', 'Veuillez ajouter des critères de recherche')
    }
  }

  public verifyFormEmpty() {
    if (this.searchFields.length != 0) {
      for (let key in this.searchFields) {
        if (this.searchForm["value"][key] != "") {
          return true
        }
      }
    }

    return false
  }

}
