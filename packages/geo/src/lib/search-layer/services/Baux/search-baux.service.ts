import { Injectable } from '@angular/core';
import { TokenService } from '@igo2/auth';
import { BauxEnvironment } from './bauxEnvironment'

@Injectable({
  providedIn: 'root'
})
export class SearchBauxService {

  private bauxUrl: string;
  private bauxEnvironment: BauxEnvironment;

  constructor(
    
    private tokenService: TokenService,
    bauxEnvironment: BauxEnvironment,
    ) { 
      this.bauxEnvironment = bauxEnvironment
      this.bauxUrl = this.bauxEnvironment.gatewayUrl + "/ows?SERVICE=WFS&REQUEST=GetFeature"
    }

  public searchLayer(searchForm, options){
    var body = this.getRequestBody(searchForm, options)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = this.tokenService.getAuthToken();

      xhr.open('POST', this.bauxUrl)
      xhr.setRequestHeader('Authorization',`Bearer ${token}`);
      
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

  private getRequestBody(searchForm, options){
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

    for (let key of Object.keys(searchForm.controls)){
      let formattedWord = this.formatEntry(searchForm["value"][key])
      if ((key === "NOM" || key === "PRENOM") && options.table === "Personne") {
        body+= `<ogc:PropertyIsLike wildCard="%" singleChar="_" escape="!" matchCase="false">
                  <ogc:PropertyName>TITULAIRE</ogc:PropertyName>
                <ogc:Literal>%${formattedWord}%</ogc:Literal>
              </ogc:PropertyIsLike>`
      }
      else {
        if(key==="CODE"){
          body+= `<ogc:PropertyIsEqualTo matchCase="false">
            <ogc:PropertyName>${key}</ogc:PropertyName>
            <ogc:Literal>${formattedWord}</ogc:Literal>
          </ogc:PropertyIsEqualTo>`
        }
        else{
          body+= `<ogc:PropertyIsLike wildCard="%" singleChar="_" escape="!" matchCase="false">
                  <ogc:PropertyName>${key}</ogc:PropertyName>
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

  public formatEntry(entry) {
    if (typeof(entry) !== "string"){
      entry = entry.toString()
    }
    
    return entry.replace(/[^\w\-]+/g, '_')
  }
}
