import { Component, ComponentRef, Injectable } from '@angular/core';
import { TokenService } from '@igo2/auth';
import { SearchBauxUiService } from '../services/search-baux-ui.service'
import { AlertController, LoadingController } from '@ionic/angular';
import { BauxEnvironment } from '../bauxEnvironment'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'

@Injectable({
  providedIn: 'root'
})
export class SearchBauxService {
  private bauxUrl: string;
  private bauxEnvironment: BauxEnvironment;
  private loading: HTMLIonLoadingElement;

  constructor(
    
    private tokenService: TokenService,
    private searchBauxUiService:SearchBauxUiService,
    private loadingController: LoadingController,
    private alertController:AlertController,
    bauxEnvironment: BauxEnvironment,
    ) { 
      this.bauxEnvironment = bauxEnvironment
      this.bauxUrl = this.bauxEnvironment.gatewayUrl + "/ows?SERVICE=WFS&REQUEST=GetFeature"
      //this.bauxUrl = "https://geoserver-dev.intranet.mrn.gouv/geoserver/SmartFaune/Baux/ows?request=GetFeatures&service=wfs"
    }

  public async searchTableAndPresent(table : string, searchFields : any, searchForm : any, component : any){
    await this.showLoading()
    this.searchTable(table, searchFields, searchForm).then(
      (value) => {
        this.dismissLoading()
        if (value['features'].length!==0){
          this.showResults(component, value['features'])
        }
        else {
          this.presentAlert('Aucun résultat trouvé', '', 'Veuillez affiner votre recherche')
        }
      },
      (value) => {
        this.dismissLoading()
        this.presentAlert('Erreur', '', value)
      })
    //this.searchTable2()
    }

  public searchTable(table : string, searchFields : any, searchForm : any){
    var body = "";
    if (table === "Person"){
      body = this.requestBodyPerson(table, searchFields, searchForm)
    }
    else {
      body = this.requestBody(table, searchFields, searchForm)
    }
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = this.tokenService.getAuthToken();

      xhr.open('POST', this.bauxUrl)
      xhr.setRequestHeader('Authorization',`Bearer ${token}`);
      //xhr.setRequestHeader('Authorization','Basic ' + btoa("AccesBaux:hXDGf6754$%dg"));
      
      xhr.onerror = function() {
        reject("Une erreur s'est produite avec la requête.")
      }
      xhr.onreadystatechange = function(){
        if(xhr.readyState===XMLHttpRequest.DONE){

          var status = xhr.status;
          if(status===0 || (status >= 200 && status < 400)){
            resolve(JSON.parse(xhr.response))
          }
          else{
            reject("Une erreur s'est produite. Veuillez vérifier votre connexion et réessayer.");
          }
        }
      }
      xhr.send(body);
    })
  }

  /*public searchTable2(){
    const body = `<wfs:GetFeature service="WFS" version="1.0.0"
    outputFormat="JSON"
    xmlns:wfs="http://www.opengis.net/wfs"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opengis.net/wfs
                        http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">
    <wfs:Query typeName="Baux">
      <ogc:Filter>
          <And><ogc:PropertyIsEqualTo>
             <ogc:PropertyName>TITULAIRE</ogc:PropertyName>
          <ogc:Literal>Club Chambeaux inc.</ogc:Literal>
        </ogc:PropertyIsEqualTo>
        </And>
        </ogc:Filter>
        </wfs:Query>
      </wfs:GetFeature>`
    const url = 'https://geoserver-dev.intranet.mrn.gouv/geoserver/SmartFaune/Baux/ows?request=GetFeatures&service=wfs'
    const xhr = new XMLHttpRequest();
      const token = this.tokenService.getAuthToken();
    xhr.open('POST', url)
      xhr.setRequestHeader('Authorization','Basic ' + btoa("AccesBaux:hXDGf6754$%dg"));
 
      xhr.onreadystatechange = function(){
        if(xhr.readyState===XMLHttpRequest.DONE){
 
          var status = xhr.status;
          if(status===0 || (status >= 200 && status < 400)){
            console.log(JSON.parse(xhr.response))
          }
          else{
            console.log('fas')
          }
        }
      }
      xhr.send(body);
    
  }*/

  public showResults(component : any, firstSearchResults : any){
    this.searchBauxUiService.showSearchResults(component, firstSearchResults)
  }


  public async presentAlert(header: string, subHeader: string, msg: string) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message: msg,
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });
    await alert.present();
  }

  private async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Recherche en cours, veuillez patienter svp...'
    });
    await this.loading.present();
  }

  private dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  private prepareQueryInputs(property : string, propertyValue : any){
    if (property==="mat18" && propertyValue.length<18){
      propertyValue += '0'.repeat(18-propertyValue.length)
    }
    return this.remove_accents(propertyValue.toUpperCase())
  }

  private remove_accents(str : string){
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  private requestBodyPerson(table : String, searchFields : any, searchForm : any){
    var body = '';
      body += `<wfs:GetFeature service="WFS" version="1.1.0"
      outputFormat="JSON"
      xmlns:wfs="http://www.opengis.net/wfs"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.opengis.net/wfs
                          http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">
      <wfs:Query typeName="Baux">
        <ogc:Filter>
            <And>`

    for (let key in searchFields){
      let formattedWord = this.formatEntry(searchForm["value"][key])
      if (searchFields[key] === "NOM" || searchFields[key] === "PRENOM") {
        body+= `<ogc:PropertyIsLike wildCard="%" singleChar="_" escape="!" matchCase="false">
                  <ogc:PropertyName>TITULAIRE</ogc:PropertyName>
                <ogc:Literal>%${formattedWord}%</ogc:Literal>
              </ogc:PropertyIsLike>`
      }
      else {
        if(searchFields[key]==="CODE"){
          body+= `<ogc:PropertyIsEqualTo matchCase="false">
            <ogc:PropertyName>${searchFields[key]}</ogc:PropertyName>
            <ogc:Literal>${formattedWord}</ogc:Literal>
          </ogc:PropertyIsEqualTo>`
        }
        else{
          body+= `<ogc:PropertyIsLike wildCard="%" singleChar="_" escape="!" matchCase="false">
                  <ogc:PropertyName>${searchFields[key]}</ogc:PropertyName>
                <ogc:Literal>%${formattedWord}%</ogc:Literal>
              </ogc:PropertyIsLike>`
        }
      }
    }
    

    body += `</And>
          </ogc:Filter>
          </wfs:Query>
        </wfs:GetFeature>`
    return body
  }

  private requestBody(table : String, searchFields : any, searchForm : any){
    var body = '';
      body += `<wfs:GetFeature service="WFS" version="1.1.0"
      outputFormat="JSON"
      xmlns:wfs="http://www.opengis.net/wfs"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.opengis.net/wfs
                          http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">
      <wfs:Query typeName="Baux">
        <ogc:Filter>
            <And>`
    for (let key in searchFields){
      let formattedWord = this.formatEntry(searchForm["value"][key])
      if(searchFields[key]==="CODE"){
        body+= `<ogc:PropertyIsEqualTo matchCase="false">
          <ogc:PropertyName>${searchFields[key]}</ogc:PropertyName>
          <ogc:Literal>${formattedWord}</ogc:Literal>
        </ogc:PropertyIsEqualTo>`
      }
      else{
        body+= `<ogc:PropertyIsLike wildCard="%" singleChar="_" escape="!" matchCase="false">
                <ogc:PropertyName>${searchFields[key]}</ogc:PropertyName>
              <ogc:Literal>%${formattedWord}%</ogc:Literal>
            </ogc:PropertyIsLike>`
      }
    }
          
    body += `</And>
          </ogc:Filter>
          </wfs:Query>
        </wfs:GetFeature>`
    return body
  }

  public verifySearch(searchFields: any, searchForm: any){
    const fields = Object.values(searchFields)
    if (fields.length < 1){
      return false
    }
    if (fields.length === 1) {
      if (fields[0] === 'Nom' || fields[0] === 'Prenom'|| fields[0] === 'Ville'){
        return false
      }
    }
    if (fields.length === 2){
      if ((fields[0]==="Ville" || fields[1]==='Ville') && !(fields[0]==='mat18' || fields[1]==='mat18')){
        return false
      }
    }
    return true
  }

  public formatEntry(entry: string) {
    var formattedWord = entry.replace(/[^\w\-]+/g, '_')
    return formattedWord
  }

}

