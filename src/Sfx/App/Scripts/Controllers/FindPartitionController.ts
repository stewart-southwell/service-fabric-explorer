//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class FindPartitionByIdController {
        static $inject = ["data", "$uibModalInstance"];
        
        partitionId: string = "04ce1925-3a10-40da-b214-9fa45c60e5da";
        status = "";
        isError = false;

        $uibModalInstance;

        constructor(private data: DataService, $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance) {
            this.$uibModalInstance = $uibModalInstance;
        }

        search() {
            this.status = "";
            this.isError = false;

            let serviceInfo;
            Utils.getHttpResponseData(this.data.restClient.getServiceNameInfo(this.partitionId)).then(info => {
                serviceInfo = info;
                this.status = "Found Service name";
                return Utils.getHttpResponseData(this.data.restClient.getApplicationNameInfo(info.Id));
            }).then(appName => {
                this.status = "Found application name";
                return this.data.getApp(appName.Id).catch( ()=> {return null})
            }).then( appInfo => {
                if(appInfo){
                    this.data.routes.navigate( ()=> this.data.routes.getPartitionViewPath(appInfo.raw.TypeName, appInfo.id, serviceInfo.Id, this.partitionId));
                    this.close();
                }else{
                    this.status = "Could not find application Type";
                    this.isError = true;
                }
            }).catch( err => {
                this.status = err.data.Error.Message;
                this.isError = true;
            })
        }

        close(){
            this.$uibModalInstance.close();
        }
    }

    (function () {

        let module = angular.module("findByPartitionController", []);
        module.controller("FindByPartitionController", FindPartitionByIdController);

    })();
}
