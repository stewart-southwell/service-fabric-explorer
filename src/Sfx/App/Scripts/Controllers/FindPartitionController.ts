//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class FindPartitionByIdController {
        static $inject = ["$scope", "dataService"];

        exhaustiveQueryName: string = "Exhaustive";

        nodeName: string = "";
        nodes: Node[] = [];
        partitionId: string = "";
        
        // clusterUpgradeProgress: ClusterUpgradeProgress;

        constructor(private data: DataService, private $scope: any, private $q: angular.IQService) {
            this.data.getNodes().then(nodeCollection => {
                this.nodes = nodeCollection.collection;
            })
        }

        search() {
            if(this.nodeName === this.exhaustiveQueryName){
                this.data.getNodes().then(nodeCollection => {
                    this.nodes = nodeCollection.collection;
                    const promises = this.nodes.map(node => this.data.restClient.findServiceByPartitionId(node.name, this.partitionId));

                    return this.$q.all(promises)
                }).then( resolves => {
                    console.log(resolves);
                })
            }else{
                this.data.restClient.findServiceByPartitionId(this.nodeName, this.partitionId).then(partition => {
                    console.log(partition);
                })
            }
        }
    }

    (function () {

        let module = angular.module("findByPartitionController", []);
        module.controller("FindByPartitionController", ["data", "$scope", FindPartitionByIdController]);

    })();
}
