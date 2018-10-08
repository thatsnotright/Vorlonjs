declare module VORLON {
    class BabylonInspectorClient extends ClientPlugin {
        private id;
        private _dataGenerator;
        engine: any;
        scenes: any;
        /**
         * Consctructor
         */
        constructor();
        /**
         * Return unique id for the plugin.
         * @returns {string}
         */
        getID(): string;
        /**
        * Refresh client : sens BABYLON Engine again.
        * Override this method with cleanup work that needs to happen
        * as the user switches between clients on the dashboard.
        */
        refresh(): void;
        /**
         * Start the clientside code : initilization etc
         */
        startClientSide(): void;
        /**
         * Handle messages received from the dashboard, on the client.
         * Then, send data back to dashboard.
         * Received objects must follow pattern :
         * {
         *  type : type of the query
         *  data : data of the query
         * }
         */
        onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void;
        /**
         * Find and return a mesh by scene ID and mesh name.
         * @param meshName
         * @param sceneID
         * @returns {any}
         * @private
         */
        private _findMesh(meshName, sceneID);
        /**
         * Send all data about the scenes
         * @private
         */
        private _sendScenesData();
        /**
         * Loop on all objects to fetch BABYLON Engine object.
         * @private
         */
        private _getBabylonEngine();
    }
}
