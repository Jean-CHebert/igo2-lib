// import { HttpClient } from '@angular/common/http';

import olSourceVector from 'ol/source/Vector';
import * as olloadingstrategy from 'ol/loadingstrategy';
import * as olformat from 'ol/format';

import { uuid } from '@igo2/utils';

import { DataSource } from './datasource';
import { WFSDataSourceOptions } from './wfs-datasource.interface';
// import { WFSDataSourceService } from './wfs-datasource.service';

export class WFSDataSource extends DataSource {
  public ol: olSourceVector;
  // public httpClient: HttpClient;

  constructor(
    public options: WFSDataSourceOptions // protected dataSourceService: WFSDataSourceService
  ) {
    super(options);
    // this.ogcFilterWriter = new OgcFilterWriter;

    this.options = this.checkWfsOptions(options);

    // if (
    //   options['sourceFields'] === undefined ||
    //   Object.keys(options['sourceFields']).length === 0
    // ) {
    //   options['sourceFields'] = [];
    // this.dataSourceService.wfsGetCapabilities(options)
    //   .map(wfsCapabilities => options['wfsCapabilities'] = {
    //     'xml': wfsCapabilities.body,
    //     'GetPropertyValue': /GetPropertyValue/gi.test(wfsCapabilities.body) ? true : false
    //   })
    //   .subscribe(val => options['sourceFields'] =
    //     this.dataSourceService.defineFieldAndValuefromWFS(options));
    // } else {
    //   options['sourceFields']
    //     .filter(
    //       field => field.values === undefined || field.values.length === 0
    //     )
    //     .forEach(f => {
    //       f.values = this.dataSourceService.getValueFromWfsGetPropertyValues(
    //         options,
    //         f.name,
    //         200,
    //         0,
    //         0
    //       );
    //     });
    // }

    // if (options.ogcFilters.filters) {
    //   options.ogcFilters.filters = this.ogcFilterWriter.checkIgoFiltersProperties(
    //     options.ogcFilters.filters, options.fieldNameGeometry, true);
    //   options.ogcFilters.interfaceOgcFilters = this.ogcFilterWriter.defineInterfaceFilterSequence(
    //     options.ogcFilters.filters, options.fieldNameGeometry);
    //
    // } else {
    //   options.ogcFilters.filters = undefined;
    //   options.ogcFilters.interfaceOgcFilters = [];
    // }
    //
    // options.isOgcFilterable = options.isOgcFilterable === undefined ?
    //   true : options.isOgcFilterable;
    // options.ogcFilters.filtersAreEditable = options.ogcFilters.filtersAreEditable === undefined ?
    //   true : options.ogcFilters.filtersAreEditable;
  }

  protected generateId() {
    return uuid();
  }

  protected createOlSource(): olSourceVector {
    const wfsOptions = this.options;

    return new olSourceVector({
      format: this.getFormatFromOptions(),
      overlaps: false,
      url: (extent, resolution, proj) => {
        const baseWfsQuery = 'service=WFS&request=GetFeature';
        // Mandatory
        const url = wfsOptions.url;
        // Optional
        const outputFormat = wfsOptions.params.outputFormat
          ? 'outputFormat=' + wfsOptions.params.outputFormat
          : '';
        const wfsVersion = wfsOptions.params.version
          ? 'version=' + wfsOptions.params.version
          : 'version=' + '2.0.0';

        let paramTypename = 'typename';
        let paramMaxFeatures = 'maxFeatures';
        if (
          wfsOptions.params.version === '2.0.0' ||
          !wfsOptions.params.version
        ) {
          paramTypename = 'typenames';
          paramMaxFeatures = 'count';
        }

        const featureTypes =
          paramTypename + '=' + wfsOptions.params.featureTypes;

        const maxFeatures = wfsOptions.params.maxFeatures
          ? paramMaxFeatures + '=' + wfsOptions.params.maxFeatures
          : paramMaxFeatures + '=5000';
        const srsname = wfsOptions.params.srsname
          ? 'srsname=' + wfsOptions.params.srsname
          : 'srsname=' + proj.getCode();
        // const filterXML = this.ogcFilterWriter.buildFilter(
        //   wfsOptions.ogcFilters.filters,
        //   extent,
        //   proj,
        //   wfsOptions.params.fieldNameGeometry
        // );

        // const patternFilter = /filter=.*/gi;
        // if (patternFilter.test(filterXML)) {
        //   this.options['ogcFiltered'] = true;
        // } else {
        //   this.options['ogcFiltered'] = false;
        // }

        let baseUrl = `${url}?${baseWfsQuery}&${wfsVersion}&${featureTypes}&`;
        baseUrl += `${outputFormat}&${srsname}&${maxFeatures}`;
        // ajouté ceci: &${filterXML}

        // this.options['download'] = Object.assign({}, this.options['download'], {
        //   dynamicUrl: baseUrl
        // });
        return baseUrl;
      },
      strategy: olloadingstrategy.bbox
    });
  }

  private getFormatFromOptions() {
    let olFormatCls;

    const outputFormat = this.options.params.outputFormat.toLowerCase();
    const patternGml3 = new RegExp('.*?gml.*?');
    const patternGeojson = new RegExp('.*?json.*?');

    if (patternGeojson.test(outputFormat)) {
      olFormatCls = olformat.GeoJSON;
    }
    if (patternGml3.test(outputFormat)) {
      olFormatCls = olformat.WFS;
    }

    return new olFormatCls();
  }

  private checkWfsOptions(
    wfsDataSourceOptions: WFSDataSourceOptions
  ): WFSDataSourceOptions {
    const mandatoryParamMissing: any[] = [];

    if (!wfsDataSourceOptions.url) {
      mandatoryParamMissing.push('url');
    }
    ['featureTypes', 'fieldNameGeometry', 'outputFormat'].forEach(element => {
      if (wfsDataSourceOptions.params[element] === undefined) {
        mandatoryParamMissing.push(element);
      }
    });

    if (mandatoryParamMissing.length > 0) {
      throw new Error(
        `A mandatory parameter is missing
          for your WFS datasource source.
          (Mandatory parameter(s) missing :` + mandatoryParamMissing
      );
    }

    // Look at https://github.com/openlayers/openlayers/pull/6400
    const patternGml = new RegExp('.*?gml.*?');

    if (patternGml.test(wfsDataSourceOptions.params.outputFormat)) {
      wfsDataSourceOptions.params.version = '1.1.0';
    }

    // wfsDataSourceOptions.ogcFilters =
    //   wfsDataSourceOptions.ogcFilters === undefined
    //     ? ({
    //         filtersAreEditable: true,
    //         filters: undefined
    //       } as OgcFiltersOptions)
    //     : wfsDataSourceOptions.ogcFilters;

    return Object.assign({}, wfsDataSourceOptions, {
      wfsCapabilities: { xml: '', GetPropertyValue: false }
    });
  }
}
