//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {
    export class TreeViewController extends ControllerWithResolver {

        private treeService: ClusterTreeService;

        private get tree(): TreeViewModel {
            return this.treeService.tree;
        }

        constructor($injector: angular.auto.IInjectorService) {
            super($injector);

            this.treeService = $injector.get<ClusterTreeService>("clusterTree");
        }

        openFindPartitionByIdModal(): void {
            this.data.$uibModal.open({
                templateUrl: "partials/find-partition-dialog.html",
                controller: FindPartitionByIdController,
                controllerAs: "ctrl"
            });
        }
    }

    (function () {

        let module = angular.module("treeViewController", []);

        module.controller("TreeViewController", ["$injector", TreeViewController]);
    })();
}
