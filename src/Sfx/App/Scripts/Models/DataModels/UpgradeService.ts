//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    export class RepairTask {
        public isSecondRowCollapsed: boolean = true;
        public raw: IRawRepairTask;

        constructor(data: IRawRepairTask) {
            this.raw = data;
        }
    }

}