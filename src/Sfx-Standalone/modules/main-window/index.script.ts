import * as $ from "jquery";
import { ICommunicator } from "sfx.remoting";
import { WebviewTag } from "electron";
import { IComponentConfiguration } from "sfx.common";
import { SfxContainer } from "./sfx-container/sfx-container";
import { DialogService } from "./dialog-service";
import { ClusterManagerComponentConfig, SettingsComponentConfig } from "./main-window";

(async () => {

    sfxModuleManager.registerComponents([DialogService.getComponentInfo(), SfxContainer.getComponentInfo()]);

    const leftpanel = $("div#left-panel");

    // TODO: load component list from setting service
    const components: IComponentConfiguration[] = [new ClusterManagerComponentConfig(), new SettingsComponentConfig()];

    try {
        await Promise.all(components.map(async component => {
            const template = $(`<div><button class="btn btn-component-head" id="c-button-${component.id}" data-component="${component.id}">${component.title}</button></div>`);
            leftpanel.append(template);

            if (component.viewUrl) {
                $(`<div id="sub-${component.id}" class="sub-panel"><webview id="wv-${component.id}" src="${component.viewUrl}" nodeintegration preload="./preload.js"></webview></div>`).appendTo(template);

                let webview = <WebviewTag>document.querySelector(`webview[id='wv-${component.id}']`);
                webview.addEventListener("dom-ready", async () => {
                    await sfxModuleManager.newHostAsync(`host-${component.id}`, await sfxModuleManager.getComponentAsync<ICommunicator>("ipc.communicator", webview.getWebContents()));

                    webview.openDevTools();
                });
            }
        }));

        $("div.sub-panel").hide();
        $("div.sub-panel:first").show();

        $(".btn-component-head").click((e) => {
            const $button = $(e.target);
            const $subPanel = $(`#sub-${$button.data("component")}`);

            $("div.sub-panel").hide();
            $subPanel.show();
        });

    } catch (error) {
        console.log(error);
    }
})();
