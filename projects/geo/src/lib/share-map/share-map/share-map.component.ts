import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { uuid, Clipboard } from '@igo2/utils';
import { ConfigService, MessageService, LanguageService } from '@igo2/core';
import { AuthService } from '@igo2/auth';
import { IgoMap } from '../../map/shared/map';

import { ShareMapService } from '../shared/share-map.service';

@Component({
  selector: 'igo-share-map',
  templateUrl: './share-map.component.html',
  styleUrls: ['./share-map.component.scss']
})
export class ShareMapComponent implements AfterViewInit, OnInit {
  public form: FormGroup;

  @Input()
  get map(): IgoMap {
    return this._map;
  }
  set map(value: IgoMap) {
    this._map = value;
  }
  private _map: IgoMap;

  @Input()
  get hasShareMapButton(): boolean {
    return this._hasShareMapButton;
  }
  set hasShareMapButton(value: boolean) {
    this._hasShareMapButton = value;
  }
  private _hasShareMapButton = true;

  @Input()
  get hasCopyLinkButton(): boolean {
    return this._hasCopyLinkButton;
  }
  set hasCopyLinkButton(value: boolean) {
    this._hasCopyLinkButton = value;
  }
  private _hasCopyLinkButton = false;

  public url: string;
  public hasApi = false;
  public userId;

  constructor(
    private config: ConfigService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private auth: AuthService,
    private shareMapService: ShareMapService,
    private formBuilder: FormBuilder
  ) {
    this.hasApi = this.config.getConfig('context.url') ? true : false;
  }

  ngOnInit(): void {
    this.auth.authenticate$.subscribe(auth => {
      const decodeToken = this.auth.decodeToken();
      this.userId = decodeToken.user ? decodeToken.user.id : undefined;
      this.url = undefined;
      this.buildForm();
    });
  }

  ngAfterViewInit(): void {
    if (!this.hasApi) {
      this.resetUrl();
    }
  }

  resetUrl(values: any = {}) {
    const inputs = Object.assign({}, values);
    inputs.uri = this.userId ? `${this.userId}-${values.uri}` : values.uri;
    this.url = this.shareMapService.getUrl(this.map, inputs);
  }

  copyTextToClipboard(textArea) {
    const successful = Clipboard.copy(textArea);
    if (successful) {
      const translate = this.languageService.translate;
      const title = translate.instant('igo.shareMap.dialog.copyTitle');
      const msg = translate.instant('igo.shareMap.dialog.copyMsg');
      this.messageService.success(msg, title);
    }
  }

  private buildForm(): void {
    const id = uuid();
    let title = 'Partage ';
    title += this.userId ? `(${this.userId}-${id})` : `(${id})`;
    this.form = this.formBuilder.group({
      title: [title],
      uri: [id]
    });
  }
}
