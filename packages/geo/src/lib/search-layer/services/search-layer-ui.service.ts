import { Injectable } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SearchLayerUiService {

  private loading: HTMLIonLoadingElement;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  public async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Recherche en cours, veuillez patienter svp...'
    });
    await this.loading.present();
  }

  public dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
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

  async showSearchWindow(component, layerName: string) {
    let componentProps;
      componentProps = {
        "layerName": layerName.replace(/\s+/g, '')
      };
    return new Promise<boolean>(async resolve => {
      const modal = await this.modalController.create({
        component: component,
        componentProps: componentProps,
        backdropDismiss: false,
        keyboardClose: true
      });
      await modal.present();
    });
  }

  async showSearchResultList(component, searchResults, layerName: any) {
    let componentProps;
      componentProps = {
        "searchResults": searchResults,
        "layerName": layerName
      };

    return new Promise<boolean>(async resolve => {
      const modal = await this.modalController.create({
        component,
        componentProps: componentProps,
        backdropDismiss: false,
        keyboardClose: true
      });
      await modal.present();
    });
  }

  async showFocusedResult(component: any, searchResults, layerName: any) {
    let componentProps;
      componentProps = {
        "layerName": layerName,
        "searchResults": searchResults
      };
    return new Promise<boolean>(async resolve => {
      const modal = await this.modalController.create({
        component,
        componentProps: componentProps,
        backdropDismiss: false,
        keyboardClose: true
      });
      await modal.present();
    });
  }

  closeModal() {
    this.modalController.dismiss();
  }

  dissmissModals() {
    this.modalController.getTop().then(
      (value) => {
        if (value) {
          this.modalController.dismiss().then(
            () => {
              this.dissmissModals();
            }
          );
        }
      }
    );
  }

  async presentInfoAlert() {
    const alert = await this.alertController.create({
      header : "Recherche étendue",
      message: "La recherche étendue permet d'obtenir plus de résultats, mais au prix d'un temps de recherche plus long.",
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });
    await alert.present();
  }
  
}
