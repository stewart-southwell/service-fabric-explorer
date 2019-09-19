//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class TreeViewController extends ControllerWithResolver {
        public static $inject = ["dataService"];

        private treeService: ClusterTreeService;

        private get tree(): TreeViewModel {
            return this.treeService.tree;
        }

        openFindPartitionByIdModal(): void {
            // console.log(this.data.$uibModal.open({
            //     templateUrl: "partials/find-partition-dialog.html",
            //     controller: FindPartitionByIdController,
            //     controllerAs: "ctrl"
            // })
            // this.data = this.$injector.get<DataService>("data");

            this.data.$uibModal.open({
                templateUrl: "partials/find-partition-dialog.html",
                controller: FindPartitionByIdController,
                controllerAs: "ctrl"
            })

            //this.data = this.$injector.get<DataService>("data");
            // let modal = this.data.$uibModal.open({
            //     templateUrl: "partials/find-partition-dialog.html",
            //     controller: FindPartitionByIdController,
            //     controllerAs: "ctrl"
            // });
            
            // new ActionWithDialog(
            //     this.data.$uibModal,
            //     this.data.$q,
            //     "disableApplicationBackup",
            //     "Disable Application Backup",
            //     "Disabling Application Backup",
            //     () => null,
            //     () => true,
            //     <angular.ui.bootstrap.IModalSettings>{
            //         templateUrl: "partials/disableBackup.html",
            //         controller: ActionController,
            //         resolve: {
            //             action: () => this
            //         }
            //     },
            //     null
            // )
        }

        constructor($injector: angular.auto.IInjectorService) {
            super($injector);

            this.treeService = $injector.get<ClusterTreeService>("clusterTree");
        }
    }

    (function () {

        let module = angular.module("treeViewController", ["dataService"]);

        module.controller("TreeViewController", ["$injector", TreeViewController]);
    })();
}
