import { Injectable } from '@angular/core';
import { TokenService } from '@igo2/auth';
import { RoleEnvironment } from './roleEnvironment'

@Injectable({
  providedIn: 'root'
})
export class SearchRoleService {

  private roleUrl: string;
  private roleEnvironment: RoleEnvironment;

  constructor(
    roleEnvironment: RoleEnvironment,
    private tokenService: TokenService,
    ) { 
      this.roleEnvironment = roleEnvironment
      this.roleUrl = this.roleEnvironment.gatewayUrl
    }

    public searchLayer(searchForm, options){
      const body = this.getRequestBody(searchForm, options)
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const token = this.tokenService.getAuthToken();
        if (options.table === "Proprio" || options.table === "Compagnie"){
          var url = this.roleUrl + '/PROPRIO'
        }
        else{
          var url = this.roleUrl + '/Role'
        }
        url += '/ows?SERVICE=WFS&REQUEST=GetFeature'

        xhr.open('POST', url)
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

  private prepareQueryInputs(property : string, propertyValue : any){
    if (property==="mat18" && propertyValue.length<18){
      propertyValue += '0'.repeat(18-propertyValue.length)
    }
    return this.remove_accents(propertyValue.toUpperCase())
  }

  private remove_accents(str : string){
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  private getRequestBody(searchForm, options) {
    if (searchForm["value"]["noLot"]){
      searchForm["value"]["noLot"] = searchForm["value"]["noLot"].replaceAll(' ', '')
    }
    var body = '';
    if (options.table === "Proprio"){
      body += `<wfs:GetFeature service="WFS" version="1.0.0"
      outputFormat="JSON"
      xmlns:wfs="http://www.opengis.net/wfs"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.opengis.net/wfs
                          http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">
      <wfs:Query typeName="RoleEvaluation:PROPRIO">
        <ogc:Filter>
            <And>`
      body+= `<ogc:PropertyIsEqualTo>
            <ogc:PropertyName>TypePersonne</ogc:PropertyName>
            <ogc:Literal>Personne physique aux fins d imposition scolaire</ogc:Literal>
          </ogc:PropertyIsEqualTo>`
    }
    else if (options.table === "Compagnie") {
      body += `<wfs:GetFeature service="WFS" version="1.0.0"
      outputFormat="JSON"
      xmlns:wfs="http://www.opengis.net/wfs"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.opengis.net/wfs
                          http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">
      <wfs:Query typeName="RoleEvaluation:PROPRIO">
        <ogc:Filter>
            <And>`
      body+= `<ogc:PropertyIsEqualTo>
            <ogc:PropertyName>TypePersonne</ogc:PropertyName>
            <ogc:Literal>Personne morale aux fins d imposition scolaire</ogc:Literal>
          </ogc:PropertyIsEqualTo>`
    }
    else{
      body += `<wfs:GetFeature service="WFS" version="1.0.0"
      outputFormat="JSON"
      xmlns:wfs="http://www.opengis.net/wfs"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.opengis.net/wfs
                          http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">
      <wfs:Query typeName="RoleEvaluation:Role">
        <ogc:Filter>
            <And>`
    }
    for (let key of Object.keys(searchForm.controls)){
      if (options.extendedSearch) {
        body+= `<ogc:PropertyIsLike wildCard="%" singleChar="_" escape="!">
          <ogc:PropertyName>${key}</ogc:PropertyName>
          <ogc:Literal>%${this.prepareQueryInputs(key, searchForm["value"][key])}%</ogc:Literal>
        </ogc:PropertyIsLike>`
      }
      else {
        body+= `<ogc:PropertyIsEqualTo>
          <ogc:PropertyName>${key}</ogc:PropertyName>
          <ogc:Literal>${this.prepareQueryInputs(key, searchForm["value"][key])}</ogc:Literal>
        </ogc:PropertyIsEqualTo>`
      }
    }
          
    body += `</And>
          </ogc:Filter>
          </wfs:Query>
        </wfs:GetFeature>`
    return body
  }

}
