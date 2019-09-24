//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class FindPartitionByIdController {
        static $inject = ["data", "$uibModalInstance"];
        
        choices: string[] = ["Partition", "Service"]
        currentChoice = this.choices[0];

        partitionId: string = "04ce1925-3a10-40da-b214-9fa45c60e5da";
        status = "";
        isError = false;

        $uibModalInstance;

        constructor(private data: DataService, $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance) {
            this.$uibModalInstance = $uibModalInstance;
        }

        private setText(text: string): void {
            this.status = text;
        }

        search() {
            this.status = "";
            this.isError = false;
            this.findPartitionInfo().catch( err => {
                this.status = err.data.Error.Message;
                this.isError = true;
            })
        }

        findPartitionInfo(): angular.IPromise<any>{             
            let serviceInfo;
            return Utils.getHttpResponseData(this.data.restClient.getServiceNameInfo(this.partitionId)).then(info => {
                serviceInfo = info;
                this.setText("Found Service name");
                return Utils.getHttpResponseData(this.data.restClient.getApplicationNameInfo(info.Id));
            }).then(appName => {
                this.setText("Found application name");
                return this.data.getApp(appName.Id).catch( ()=> {return null})
            }).then( appInfo => {
                if(appInfo){
                    this.data.routes.navigate( ()=> this.data.routes.getPartitionViewPath(appInfo.raw.TypeName, appInfo.id, serviceInfo.Id, this.partitionId));
                    this.close();
                }else{
                    this.setText("Could not find application Type");
                    this.isError = true;
                }
            })
        }


        findServiceInfoByPartitionId(partitionId: string, data: any): angular.IPromise<any>{
            return this.data.$q( (resolve, reject) => {
                Utils.getHttpResponseData(this.data.restClient.getServiceNameInfo(partitionId)).then(info => {
                    data.serviceInfo = info;
                    this.setText("Found Service name");
                    resolve(data);
                }).catch(err => {
                    reject({error: "Could not find application Type"});
                })
            })
        }

        findAppInfoByServiceName(name: string, data: any): angular.IPromise<any>{
            return this.data.$q( (resolve, reject) => {
                this.data.getApp(name).then(info => {
                    data.appTypeName = info.raw.TypeName;
                    resolve(data);
                }).catch(err => {
                    reject({error: "Could not find application Type"});
                })
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
