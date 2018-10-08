declare module VORLON {
    class BabylonInspectorDashboard extends DashboardPlugin {
        private id;
        private _dataTreeGenerator;
        private treeRoot;
        private _containerDiv;
        displayer: HTMLElement;
        /**
         * Do any setup you need, call super to configure
         * the plugin with html and css for the dashboarde
         */
        constructor();
        /**
         * Return unique id for your plugin
         */
        getID(): string;
        /**
         * When we get a message from the client, handle it
         */
        onRealtimeMessageReceivedFromClientSide(receivedObject: any): void;
        /**
         * Send a query to client of type queryType containing some data.
         * @param queryType
         * @param data
         */
        queryToClient(queryType: QueryTypes, data: any): void;
        /**
         * This code will run on the dashboard
         * Start dashboard code
         * uses _insertHtmlContentAsync to insert the control.html content
         * into the dashboard
         * @param div
         */
        startDashboardSide(div?: HTMLDivElement): void;
        /**
         * Refresh tree.
         * @param scenesData
         * @private
         */
        private _refreshTree(scenesData, clientURL);
    }
}
