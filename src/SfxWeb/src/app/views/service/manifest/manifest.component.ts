import { Component, OnInit, Injector } from '@angular/core';
import { ServiceBaseController } from '../ServiceBase';
import { DataService } from 'src/app/services/data.service';
import { IResponseMessageHandler } from 'src/app/Common/ResponseMessageHandlers';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-manifest',
  templateUrl: './manifest.component.html',
  styleUrls: ['./manifest.component.scss']
})
export class ManifestComponent extends ServiceBaseController {
  serviceManifest: string;

  constructor(protected data: DataService, injector: Injector) { 
    super(data, injector);
  }

  setup() {}

  refresh(messageHandler?: IResponseMessageHandler): Observable<any>{
    let app = this.service.parent;
    console.log(app.raw.TypeName);
    console.log(app);

    console.log(this.service.description.raw.ServiceTypeName);
    return this.data.getServiceType(app.raw.TypeName, app.raw.TypeVersion, this.service.description.raw.ServiceTypeName, true, messageHandler)
        .pipe(mergeMap(serviceType => {
            return serviceType.manifest.refresh(messageHandler).pipe(map(() => {
                this.serviceManifest = serviceType.manifest.raw.Manifest;
            }));
        }));
  }
}