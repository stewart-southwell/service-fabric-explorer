import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ListSettings, ListColumnSettingForLink, ListColumnSetting, ListColumnSettingWithFilter, ListColumnSettingForBadge } from 'src/app/Models/ListSettings';
import { NodeCollection } from 'src/app/Models/DataModels/Collections';
import { IResponseMessageHandler } from 'src/app/Common/ResponseMessageHandlers';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-all-nodes',
  templateUrl: './all-nodes.component.html',
  styleUrls: ['./all-nodes.component.scss']
})
export class AllNodesComponent implements OnInit {

  nodes: NodeCollection;
  listSettings: ListSettings;

  constructor(private data: DataService, private settings: SettingsService) { }

  ngOnInit() {
    this.nodes = this.data.nodes;
    this.listSettings = this.settings.getNewOrExistingListSettings("nodes", ["name"], [
      new ListColumnSettingForLink("name", "Name", item => item.viewPath),
      new ListColumnSetting("raw.IpAddressOrFQDN", "Address"),
      new ListColumnSettingWithFilter("raw.Type", "Node Type"),
      new ListColumnSettingWithFilter("raw.UpgradeDomain", "Upgrade Domain"),
      new ListColumnSettingWithFilter("raw.FaultDomain", "Fault Domain"),
      new ListColumnSettingWithFilter("raw.IsSeedNode", "Is Seed Node"),
      new ListColumnSettingForBadge("healthState", "Health State"),
      new ListColumnSettingWithFilter("nodeStatus", "Status"),
  ]);
  this.refresh().subscribe();
}

refresh(messageHandler?: IResponseMessageHandler): Observable<any> {
  return  this.nodes.refresh(messageHandler);
}

}