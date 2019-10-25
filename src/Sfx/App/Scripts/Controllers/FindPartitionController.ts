//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {
    export interface IDropDownData{
        name: string;
        example: string;
        inputLabel: string;
        requiresNode: boolean;
    }

    export interface ISearch {

    }

    export class FindPartitionByIdController {
        static $inject = ["data", "$uibModalInstance"];
        
        choices: IDropDownData[] = [{name: "Application",
                                     example: "myapp",
                                     inputLabel: "Application Name",
                                     requiresNode: false },
                                    {name: "Partition",
                                     example: "611b7529-4be8-4232-80f8-beaea312e7ef",
                                     inputLabel: "Partition Id",
                                     requiresNode: false },
                                    {name: "Service",
                                     example: "myapp/app1/svc1",
                                     inputLabel: "Service Id",
                                     requiresNode: false },
                                     {name: "Deployed Service Pkg",
                                     example: "myapp/app1/svc1",
                                     inputLabel: "Service Id",
                                     requiresNode: true }]

        currentChoice = this.choices[0];

        model: string = "04ce1925-3a10-40da-b214-9fa45c60e5da";
        status = "";
        isError = false;

        $uibModalInstance;

        nodeName: string = "";
        nodes: any[] = [];

        constructor(private data: DataService, $uibModalInstance: angular.ui.bootstrap.IModalServiceInstance) {
            this.$uibModalInstance = $uibModalInstance;
            this.data.getNodes().then(data => {
                this.nodes = data.collection.map(node => node.name);
            })
        }

        private setText(text: string): void {
            this.status = text;
        }

        search() {
            this.status = "";
            this.isError = false;
            let data = {};
            let promise;
            switch (this.currentChoice.name) {
                case "Partition":
                    promise = this.findPartitionInfo(this.model, data).then( data => {
                        this.data.routes.navigate( () => this.data.routes.getPartitionViewPath(data.appTypeName, data.applicationId, data.serviceId, this.model))
                        this.close();
                        })
                    break;
            
                case "Service":
                    promise = this.findServiceInfo(this.model, data).then( data => {
                        this.data.routes.navigate( () => this.data.routes.getServiceViewPath(data.appTypeName, data.applicationId, data.serviceId))
                        this.close();
                    })
                    break;
                    
                case "Application":
                    promise = this.findApplicationInfo(this.model, data).then( data => {
                        this.data.routes.navigate( () => this.data.routes.getAppViewPath(data.appTypeName, data.applicationId))
                        this.close();
                    })
                    break;
                case "Deployed Service Pkg":
                    promise = this.findDeployServiceReplicaInfo(this.model, this.nodeName, data).then( data => {
                        this.data.routes.navigate( () => this.data.routes.getDeployedReplicaViewPath(data.appTypeName, data.applicationId))
                        this.close();
                    })
                    break;
                default:
                    break;
            }
            promise.catch( err => {
                this.setText(err.error);
                this.isError = true;
            })
        }
        
        findServiceInfo(serviceName: string, data: any): angular.IPromise<any>{
            data.serviceId = serviceName.replace("fabric:/", "");
            return this.findAppInfoByServiceName(serviceName.replace("fabric:/", ""), data);
        }

        findApplicationInfo(applicationName: string, data: any): angular.IPromise<any>{
            data.applicationId = applicationName.replace("fabric:/", "")
            data.applicationName = applicationName;
            return this.data.$q( (resolve, reject) => {
                return this.data.getApp(data.applicationId).then(info => {
                    data.appTypeName = info.raw.TypeName;
                    resolve(data);
                }).catch(err => {
                    reject({error: "Could not find application"});
                })
            })
        }

        findPartitionInfo(partitionId: string, data: any): angular.IPromise<any>{
            return this.data.$q( (resolve, reject) => {
                Utils.getHttpResponseData(this.data.restClient.getServiceNameInfo(partitionId)).then(info => {
                    data.serviceId = info.Id;
                    data.serviceName = info.Name;
                    this.setText("Found Service name");
                    this.findAppInfoByServiceName(info.Id, data).then(data => {
                        resolve(data);
                    }).catch( err => reject(err));
                }).catch(err => {
                    reject({error: "Could not find corresponding Service"});
                })
            })
        }

        findDeployServiceReplicaInfo(partitionId: string, nodeName:string, data: any): angular.IPromise<any>{
            return this.data.$q( (resolve, reject) => {
                this.data.restClient.FindDeployedServiceReplicaDetailByPartitionId(nodeName, partitionId).then(data => {
                    console.log(data);
                }).catch(err => {
                    console.log(err);
                })
            })
        }

        findAppInfoByServiceName(name: string, data: any): angular.IPromise<any>{
            console.log("..?")
            return this.data.$q( (resolve, reject) => {
                console.log("wait");
                Utils.getHttpResponseData(this.data.restClient.getApplicationNameInfo(name)).then( appInfo => {
                    data.applicationId = appInfo.Id;
                    return this.data.getApp(appInfo.Id);
                }).then(info => {
                    this.setText("Found Application name");
                    data.appName = name;
                    data.appTypeName = info.raw.TypeName;
                    resolve(data);
                }).catch(err => {
                    reject({error: "Could not find corresponding application Type"});
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
