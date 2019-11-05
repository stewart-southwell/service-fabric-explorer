//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class RepairTaskListDirective implements ng.IDirective {
        public restrict = "E";
        public replace = true;
        public controller = RepairTaskController;
        public controllerAs = "ctrl";
        public templateUrl = "partials/timeline.html";
        public scope = {
            // events: "=",
        };
        // public transclude = true;

        public link($scope: any, element: JQuery, attributes: any, ctrl: RepairTaskController) {

            // $scope.$watchCollection("events", () => {

            //     // if ($scope.events) {
            //     //     ctrl.updateList($scope.events);
            //     // }
            // });
        }
    }

    export class RepairTaskController {
        public static $inject = ["$scope", "data", "settings"];

        // selectedStateOptions = [
        //     {name: "Created", value: 1},
        //     {name: "Claimed", value: 2},
        //     {name: "Preparing", value: 4},
        //     {name: "Approved", value: 8},
        //     {name: "Executing", value: 16},
        //     {name: "Restoring", value: 32},
        //     {name: "Completed", value: 64},
        // ]
        // selectedStates = {name: string, value: number}[];
        // taskIdFilter = "";
        // executorFilter = "";

        public tasks: IRawRepairTask[] = [];
        public listSettings: ListSettings;

        public constructor(public $scope: any, public data: DataService, public settings: SettingsService) {
            this.listSettings = this.settings.getNewOrExistingListSettings("repairTask", [""], [
                new ListColumnSetting("TaskId", "Task Id"),
                new ListColumnSetting("Action", "Action"),
                new ListColumnSetting("Target", "Target"),
            ],
            [new ListColumnSetting(
                "TaskId",
                "",
                [],
                null,
                (item) => HtmlUtils.getEventSecondRowHtml(item.raw),
                -1), ],
            true,
            (item) => (Object.keys(item).length > 0),
            true);

        }

        public search() {
            // const stateFilter = this.selectedStates.reduce( (previous, current) => previous += current.value, 0);
            Utils.getHttpResponseData(this.data.restClient.getRepairTasks("", 127)).then(data => {
                this.tasks = data;
            })
        }
    }
}
