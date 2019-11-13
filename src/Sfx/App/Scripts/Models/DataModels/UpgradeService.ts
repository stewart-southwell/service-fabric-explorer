//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

module Sfx {

    declare var moment: any;


    export class RepairTask {
        public isSecondRowCollapsed: boolean = true;
        public raw: IRawRepairTask;

        constructor(data: IRawRepairTask) {
            this.raw = data;
        }

        public get duration(): string{
            if(this.raw.History.ExecutingUtcTimestamp && this.raw.History.CompletedUtcTimestamp){
                const t1 = moment(this.raw.History.ExecutingUtcTimestamp);
                const t2 = moment(this.raw.History.CompletedUtcTimestamp);
                const t3 = moment(t2.diff(t1)).format("hh:mm:ss");
                return t3
            }

            return null;
        }
    }

}