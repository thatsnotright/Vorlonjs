var VORLON;
(function (VORLON) {
    (function (QueryTypes) {
        QueryTypes[QueryTypes["SPOT_MESH"] = 0] = "SPOT_MESH";
        QueryTypes[QueryTypes["UNSPOT_MESH"] = 1] = "UNSPOT_MESH";
        QueryTypes[QueryTypes["START_ANIM"] = 2] = "START_ANIM";
        QueryTypes[QueryTypes["PAUSE_ANIM"] = 3] = "PAUSE_ANIM";
        QueryTypes[QueryTypes["UNPAUSE_ANIM"] = 4] = "UNPAUSE_ANIM";
        QueryTypes[QueryTypes["STOP_ANIM"] = 5] = "STOP_ANIM";
        QueryTypes[QueryTypes["TURN_ON_LIGHT"] = 6] = "TURN_ON_LIGHT";
        QueryTypes[QueryTypes["TURN_OFF_LIGHT"] = 7] = "TURN_OFF_LIGHT";
        QueryTypes[QueryTypes["HIDE_MESH"] = 8] = "HIDE_MESH";
        QueryTypes[QueryTypes["DISPLAY_MESH"] = 9] = "DISPLAY_MESH";
        QueryTypes[QueryTypes["DISPLAY_MESH_GIZMO"] = 10] = "DISPLAY_MESH_GIZMO";
        QueryTypes[QueryTypes["HIDE_MESH_GIZMO"] = 11] = "HIDE_MESH_GIZMO";
    })(VORLON.QueryTypes || (VORLON.QueryTypes = {}));
    var QueryTypes = VORLON.QueryTypes;
    ;
    (function (AnimTargetTypes) {
        AnimTargetTypes[AnimTargetTypes["MESH"] = 0] = "MESH";
        AnimTargetTypes[AnimTargetTypes["MATERIAL"] = 1] = "MATERIAL";
        AnimTargetTypes[AnimTargetTypes["CAMERA"] = 2] = "CAMERA";
        AnimTargetTypes[AnimTargetTypes["LIGHT"] = 3] = "LIGHT";
        AnimTargetTypes[AnimTargetTypes["SKELETTON"] = 4] = "SKELETTON";
    })(VORLON.AnimTargetTypes || (VORLON.AnimTargetTypes = {}));
    var AnimTargetTypes = VORLON.AnimTargetTypes;
    ;
})(VORLON || (VORLON = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VORLON;
(function (VORLON) {
    var DataGenerator = (function () {
        //ATTRIBUTES
        //CONSTRUCTOR
        /**
         * Constructor.
         * Does nothing.
         */
        function DataGenerator() {
            //TOOLS
            /**
             * Converts a Color3 into a hex string
             * @param color
             */
            this._color3ToHex = function (color) {
                function componentToHex(c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }
                return "#" + componentToHex(color.r * 255) + componentToHex(color.g * 255) + componentToHex(color.b * 255);
            };
        }
        //REQUESTS
        /**
         * Generate data about scenes
         * @returns {Array}
         * @private
         */
        DataGenerator.prototype.generateScenesData = function (scenes) {
            var _this = this;
            var data = [];
            scenes.forEach(function (scene) {
                var sceneData = {
                    activeCameraData: _this._generateCameraData(scene.activeCamera),
                    meshesData: _this._generateMeshesData(scene),
                    //texturesData: this._generateTexturesData(scene),
                    camerasData: _this._generateCamerasData(scene),
                    lightsData: _this._generateLightsData(scene)
                };
                data.push(sceneData);
            });
            return data;
        };
        /**
         * Round a number with afterComa numbers after the coma.
         * @param nbr
         * @param afterComa
         * @returns {number}
         * @private
         */
        DataGenerator.prototype._roundNumber = function (nbr, afterComa) {
            var pow = Math.pow(10, afterComa);
            return Math.round(pow * nbr) / pow;
        };
        /**
         * Round each x, y and y components of a Vector3
         * @param vec
         * @param afterComa
         * @returns {any}
         * @private
         */
        DataGenerator.prototype._roundVector3 = function (vec, afterComa) {
            var result = new BABYLON.Vector3(this._roundNumber(vec.x, 2), this._roundNumber(vec.y, 2), this._roundNumber(vec.z, 2));
            return result;
        };
        /**
         * Generate data object for a material object.
         * Result contains name, color, texture.
         * @param mat
         * @returns {{name: any, ambientColor: string, diffuseColor: string, emissiveColor: string, specularColor: string}}
         */
        DataGenerator.prototype._generateMaterialData = function (mat) {
            var data;
            data = {
                name: mat.name,
                ambientColor: mat.ambientColor ? this._color3ToHex(mat.ambientColor) : undefined,
                diffuseColor: mat.diffuseColor ? this._color3ToHex(mat.diffuseColor) : undefined,
                emissiveColor: mat.emissiveColor ? this._color3ToHex(mat.emissiveColor) : undefined,
                specularColor: mat.specularColor ? this._color3ToHex(mat.specularColor) : undefined,
                diffuseTexture: mat.diffuseTexture ? this._generateTextureData(mat.diffuseTexture) : undefined
            };
            return data;
        };
        /**
         * Generate data object for a multi-material object.
         * Result contains name, color, texture.
         * @param mat
         */
        DataGenerator.prototype._generateMultiMaterialData = function (multimat) {
            var _this = this;
            var subMaterials = [];
            multimat.subMaterials.forEach(function (mat) {
                subMaterials.push(_this._generateMaterialData(mat));
            });
            var data = {
                name: multimat.name,
                subMaterials: subMaterials
            };
            return data;
        };
        /**
         * Generate data about meshes
         * @param scene
         * @returns {Array}
         * @private
         */
        DataGenerator.prototype._generateMeshesData = function (scene) {
            var _this = this;
            var data = [];
            scene.meshes.forEach(function (mesh) {
                data.push({
                    name: mesh.name,
                    isVisible: mesh.isVisible,
                    position: _this._roundVector3(mesh.position, 2),
                    rotation: _this._roundVector3(mesh.rotation, 2),
                    scaling: _this._roundVector3(mesh.scaling, 2),
                    boundingBoxCenter: _this._roundVector3(mesh.getBoundingInfo().boundingBox.center, 2),
                    material: mesh.material && !mesh.material.subMaterials ? _this._generateMaterialData(mesh.material) : undefined,
                    multiMaterial: mesh.material && mesh.material.subMaterials ? _this._generateMultiMaterialData(mesh.material) : undefined,
                    animations: _this._generateAnimationData(mesh.animations)
                });
            });
            return data;
        };
        /**
         * Generate data object for a texture object.
         * Result contains name, url.
         * @param txtr
         * @returns {{name: any, url: any}}
         * @private
         */
        DataGenerator.prototype._generateTextureData = function (txtr) {
            var data = {
                name: txtr.name,
                url: txtr.url
            };
            return data;
        };
        /**
         * Generate data about textures of one scene.
         * @param scene
         * @returns {Array}
         * @private
         */
        DataGenerator.prototype._generateTexturesData = function (scene) {
            var _this = this;
            var data = [];
            scene.textures.forEach(function (txtr) {
                data.push(_this._generateTextureData(txtr));
            });
            return data;
        };
        /**
         * Generate data about animations of an object
         * @param scene
         * @returns {Array}
         * @private
         */
        DataGenerator.prototype._generateAnimationData = function (animations) {
            var data = [];
            animations.forEach(function (anim) {
                var keys = anim.getKeys();
                data.push({
                    name: anim.name,
                    targetProperty: anim.targetProperty,
                    framePerSecond: anim.framePerSecond,
                    stopped: anim._stopped,
                    beginFrame: keys[0].frame,
                    endFrame: keys[keys.length - 1].frame
                });
            });
            return data;
        };
        /**
         * Generate data for one camera.
         * @param cam
         * @returns {{name: any, type: (string|string|string), position: any, animations: Array, speed: (any|number), rotation: any, alpha: number, beta: number, radius: number}}
         * @private
         */
        DataGenerator.prototype._generateCameraData = function (cam) {
            function getCameraType(cam) {
                if (cam instanceof BABYLON.FreeCamera) {
                    return "FreeCamera";
                }
                else if (cam instanceof BABYLON.ArcRotateCamera) {
                    return "ArcRotateCamera";
                }
                else {
                    return "Camera";
                }
            }
            var camType = getCameraType(cam);
            var camData = {
                name: cam.name,
                type: camType,
                mode: cam.mode == 0 ? 'perspective' : 'orthographic',
                layerMask: cam.layerMask.toString(2),
                position: this._roundVector3(cam.position, 2),
                animations: this._generateAnimationData(cam.animations),
                speed: camType == "FreeCamera" ? cam.speed : undefined,
                rotation: camType == "FreeCamera" ? this._roundVector3(cam.rotation, 2) : undefined,
                alpha: camType == "ArcRotateCamera" ? this._roundNumber(cam.alpha, 2) : undefined,
                beta: camType == "ArcRotateCamera" ? this._roundNumber(cam.beta, 2) : undefined,
                radius: camType == "ArcRotateCamera" ? this._roundNumber(cam.radius, 2) : undefined
            };
            return camData;
        };
        /**
         * Generate data about cameras of one scene.
         * @param scene
         * @returns {Array}
         * @private
         */
        DataGenerator.prototype._generateCamerasData = function (scene) {
            var _this = this;
            var data = [];
            scene.cameras.forEach(function (cam) {
                var camData = _this._generateCameraData(cam);
                data.push(camData);
            });
            return data;
        };
        /**
         * Generate data about lights of one scene.
         * @param scene
         * @returns {Array}
         * @private
         */
        DataGenerator.prototype._generateLightsData = function (scene) {
            var _this = this;
            function getLightType(light) {
                if (light instanceof BABYLON.PointLight) {
                    return "PointLight";
                }
                else if (light instanceof BABYLON.HemisphericLight) {
                    return "HemisphericLight";
                }
                else if (light instanceof BABYLON.SpotLight) {
                    return "SpotLight";
                }
                else if (light instanceof BABYLON.DirectionalLight) {
                    return "DirectionalLight";
                }
                else {
                    return "None";
                }
            }
            var data = [];
            scene.lights.forEach(function (light) {
                var lightType = getLightType(light);
                data.push({
                    name: light.name,
                    position: lightType != 'HemisphericLight' ? _this._roundVector3(light.position, 2) : undefined,
                    diffuse: _this._color3ToHex(light.diffuse),
                    specular: _this._color3ToHex(light.specular),
                    intensity: light.intensity,
                    type: lightType,
                    direction: lightType == 'HemisphericLight' ? _this._roundVector3(light.direction, 2) : undefined,
                    groundColor: lightType == 'HemisphericLight' ? _this._color3ToHex(light.groundColor) : undefined,
                    isEnabled: light._isEnabled
                });
            });
            return data;
        };
        /**
         * Generate data about register before render functions of one scene.
         * @param scene
         * @returns {Array}
         * @private
         */
        DataGenerator.prototype._generateBeforeRenderData = function (scene) {
            var data = [];
            scene._onBeforeRenderCallbacks.forEach(function (fct) {
                data.push({
                    body: fct.toString(2)
                });
            });
            return data;
        };
        /**
         * Generate data about register after render functions of one scene.
         * @param scene
         * @returns {Array}
         * @private
         */
        DataGenerator.prototype._generateAfterRenderData = function (scene) {
            var data = [];
            scene._onAfterRenderCallbacks.forEach(function (fct) {
                data.push({
                    body: fct.toString(2)
                });
            });
            return data;
        };
        return DataGenerator;
    }());
    /**
     * Class for queries sent by dashboard.
     * For each new query type, extend this class and
     * override findTarget() and execute() function.
     */
    var Query = (function () {
        function Query(client, queryObject) {
            this.client = client;
            this.queryType = queryObject.queryType;
            this.data = queryObject.data;
            this.target = null;
            this.targetName = null;
            this.sceneID = this.data.sceneID;
        }
        /**
         * Execute the query (performs a specific action depending on the type
         * of query).
         */
        Query.prototype.execute = function () {
        };
        /**
         * Find the object target of the query thanks to its name (targetName)
         * and the id of the scene it belongs in (sceneID).
         */
        Query.prototype.findTarget = function () {
        };
        return Query;
    }());
    /**
     * For spotting or unspotting mesh.
     * The target is the mesh in question.
     */
    var SpotMeshQuery = (function (_super) {
        __extends(SpotMeshQuery, _super);
        function SpotMeshQuery(client, queryObject) {
            _super.call(this, client, queryObject);
            this.targetName = this.data.meshName;
            this.findTarget();
        }
        SpotMeshQuery.prototype.execute = function () {
            switch (this.queryType) {
                case VORLON.QueryTypes.SPOT_MESH:
                    this._spotMesh(this.target);
                    break;
                case VORLON.QueryTypes.UNSPOT_MESH:
                    this._unspotMesh(this.target);
                    break;
                default:
                    // not supposed to happen
                    break;
            }
        };
        SpotMeshQuery.prototype.findTarget = function () {
            var scene = this.client.scenes[this.sceneID];
            this.target = scene.getMeshByName(this.targetName);
        };
        /**
         * Spot a mesh on the scene by (changing its material ? making it blink ? (that'd be nice))
         * @param meshName
         * @param sceneID
         * @private
         */
        SpotMeshQuery.prototype._spotMesh = function (mesh) {
            var index = SpotMeshQuery.spottedMeshes.indexOf(mesh);
            if (index >= 0) {
                return;
            }
            SpotMeshQuery.spottedMeshes.push(mesh);
            SpotMeshQuery.spottedMeshesMaterials.push(mesh.material);
            var spotMaterial = new BABYLON.StandardMaterial("spotMaterial", mesh._scene);
            spotMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);
            mesh.material = spotMaterial;
        };
        /**
         * Set initial material on mesh if it was spotted.
         * @param mesh
         * @private
         */
        SpotMeshQuery.prototype._unspotMesh = function (mesh) {
            var index = SpotMeshQuery.spottedMeshes.indexOf(mesh);
            if (index < 0) {
                return;
            }
            mesh.material = SpotMeshQuery.spottedMeshesMaterials[index];
            SpotMeshQuery.spottedMeshes.splice(index, 1);
            SpotMeshQuery.spottedMeshesMaterials.splice(index, 1);
        };
        SpotMeshQuery.spottedMeshes = [];
        SpotMeshQuery.spottedMeshesMaterials = [];
        return SpotMeshQuery;
    }(Query));
    /**
     * Query to turn a light on or off.
     */
    var SwitchLightQuery = (function (_super) {
        __extends(SwitchLightQuery, _super);
        function SwitchLightQuery(client, queryObject) {
            _super.call(this, client, queryObject);
            this.targetName = queryObject.data.lightName;
            this.findTarget();
        }
        SwitchLightQuery.prototype.execute = function () {
            switch (this.queryType) {
                case VORLON.QueryTypes.TURN_OFF_LIGHT:
                    this._turnOffLight(this.target);
                    break;
                case VORLON.QueryTypes.TURN_ON_LIGHT:
                    this._turnOnLight(this.target);
                    break;
                default:
                    // not supposed to happen
                    break;
            }
        };
        SwitchLightQuery.prototype.findTarget = function () {
            var scene = this.client.scenes[this.sceneID];
            this.target = scene.getLightByName(this.targetName);
        };
        SwitchLightQuery.prototype._turnOnLight = function (light) {
            light._isEnabled = true;
        };
        SwitchLightQuery.prototype._turnOffLight = function (light) {
            light._isEnabled = false;
        };
        return SwitchLightQuery;
    }(Query));
    /**
     * Query to hide or display a mesh.
     */
    var ToggleMeshVisibilityQuery = (function (_super) {
        __extends(ToggleMeshVisibilityQuery, _super);
        function ToggleMeshVisibilityQuery(client, queryObject) {
            _super.call(this, client, queryObject);
            this.targetName = queryObject.data.meshName;
            this.findTarget();
        }
        ToggleMeshVisibilityQuery.prototype.execute = function () {
            switch (this.queryType) {
                case VORLON.QueryTypes.HIDE_MESH:
                    this._hideMesh(this.target);
                    break;
                case VORLON.QueryTypes.DISPLAY_MESH:
                    this._displayMesh(this.target);
                    break;
                default:
                    // not supposed to happen
                    break;
            }
        };
        ToggleMeshVisibilityQuery.prototype.findTarget = function () {
            var scene = this.client.scenes[this.sceneID];
            this.target = scene.getMeshByName(this.targetName);
        };
        ToggleMeshVisibilityQuery.prototype._hideMesh = function (mesh) {
            mesh.isVisible = false;
        };
        ToggleMeshVisibilityQuery.prototype._displayMesh = function (mesh) {
            mesh.isVisible = true;
        };
        return ToggleMeshVisibilityQuery;
    }(Query));
    /**
    * Query to display or hide axis of a mesh
    */
    var GizmoOnMeshQuery = (function (_super) {
        __extends(GizmoOnMeshQuery, _super);
        function GizmoOnMeshQuery(client, queryObject) {
            _super.call(this, client, queryObject);
            this.targetName = queryObject.data.meshName;
            this.findTarget();
            this.gizmos = [];
        }
        GizmoOnMeshQuery.prototype.execute = function () {
            switch (this.queryType) {
                case VORLON.QueryTypes.HIDE_MESH_GIZMO:
                    this._hideMeshGizmos();
                    break;
                case VORLON.QueryTypes.DISPLAY_MESH_GIZMO:
                    this._displayMeshGizmos();
                    break;
                default:
                    // not supposed to happen
                    break;
            }
        };
        GizmoOnMeshQuery.prototype.findTarget = function () {
            var scene = this.client.scenes[this.sceneID];
            this.target = scene.getMeshByName(this.targetName);
        };
        /**
         * Build tubes that will be the mesh's axis.
         * If the mesh is named meshName, their names will be
         * "meshName_xAxis", "meshName_yAxis" and "meshName_zAxis"
         *
         * @private
         */
        GizmoOnMeshQuery.prototype._buildGizmos = function () {
            var _this = this;
            var scene = this.client.scenes[this.sceneID];
            var directions = this.target.getBoundingInfo().boundingBox.directions;
            //Start tube at (0,0,0) because it will be automaticaly attached to the mesh when
            // we set tube's parent
            var center = new BABYLON.Vector3(0, 0, 0);
            var size = 2 * this.target.getBoundingInfo().boundingSphere.radius;
            var pathX = [center, center.add(directions[0].scaleInPlace(size))];
            this.gizmos[0] = BABYLON.Mesh.CreateTube(this.target.name + '_xAxis', pathX, 0.03, 10, null, scene);
            this.gizmos[0].material = new BABYLON.StandardMaterial(this.target.name + "_xAxisMat", scene);
            this.gizmos[0].material.emissiveColor = BABYLON.Color3.Red();
            var pathY = [center, center.add(directions[1].scaleInPlace(size))];
            this.gizmos[1] = BABYLON.Mesh.CreateTube(this.target.name + '_yAxis', pathY, 0.03, 10, null, scene);
            this.gizmos[1].material = new BABYLON.StandardMaterial(this.target.name + "_yAxisMat", scene);
            this.gizmos[1].material.emissiveColor = BABYLON.Color3.Blue();
            var pathZ = [center, center.add(directions[2].scaleInPlace(size))];
            this.gizmos[2] = BABYLON.Mesh.CreateTube(this.target.name + '_zAxis', pathZ, 0.03, 10, null, scene);
            this.gizmos[2].material = new BABYLON.StandardMaterial(this.target.name + "_zAxisMat", scene);
            this.gizmos[2].material.emissiveColor = BABYLON.Color3.Green();
            this.gizmos.forEach(function (g) {
                g.parent = _this.target;
            });
            // Exclude guizmos from lights so their color does not change
            scene.lights.forEach(function (l) {
                _this.gizmos.forEach(function (g) {
                    l.excludedMeshes.push(g);
                });
            });
        };
        /**
         * Search the scene for meshes representing gizmos.
         * If found, return true, else return false.
         * @returns {boolean}
         * @private
         */
        GizmoOnMeshQuery.prototype._gizmosAlreadyExist = function () {
            var scene = this.client.scenes[this.sceneID];
            var gizmoX = scene.getMeshByName(this.target.name + '_xAxis');
            return gizmoX == undefined ? false : true;
        };
        /**
         * Find mesh axes if they already exist
         * @private
         */
        GizmoOnMeshQuery.prototype._findGizmos = function () {
            if (!this._gizmosAlreadyExist()) {
                return;
            }
            var scene = this.client.scenes[this.sceneID];
            this.gizmos[0] = scene.getMeshByName(this.target.name + '_xAxis');
            this.gizmos[1] = scene.getMeshByName(this.target.name + '_yAxis');
            this.gizmos[2] = scene.getMeshByName(this.target.name + '_zAxis');
        };
        /**
         * Hide mesh axes
         * @private
         */
        GizmoOnMeshQuery.prototype._hideMeshGizmos = function () {
            if (!this._gizmosAlreadyExist()) {
                this._buildGizmos();
            }
            else {
                this._findGizmos();
            }
            this.gizmos.forEach(function (g) {
                g.isVisible = false;
            });
        };
        /**
         * Display mesh axes
         * @private
         */
        GizmoOnMeshQuery.prototype._displayMeshGizmos = function () {
            if (!this._gizmosAlreadyExist()) {
                this._buildGizmos();
            }
            else {
                this._findGizmos();
            }
            this.gizmos.forEach(function (g) {
                g.isVisible = true;
            });
        };
        return GizmoOnMeshQuery;
    }(Query));
    ///**
    // * For queries about animation (start etc).
    // */
    //class AnimQuery extends Query {
    //
    //    private animTargetType : AnimTargetTypes;
    //    private animTargetName : string;
    //    private animTarget;
    //    private copyOfTargetAnimations : Array <any>;
    //    private currentFrame : number;
    //
    //    constructor(client, queryObject) {
    //        super(client, queryObject);
    //        this.targetName = this.data.animName;
    //        this.animTargetName = this.data.animTargetName;
    //        this.animTargetType = this.data.animTargetType;
    //        this.copyOfTargetAnimations = [];
    //        this.findTarget();
    //    }
    //
    //    public findTarget() : void {
    //        //might be unnecessary
    //        this._findAnimTarget();
    //        var animations = this.animTarget.animations;
    //        for(var i = 0; i < animations.length; ++i) {
    //            if (animations[i].name == this.targetName) {
    //                this.target = animations[i];
    //                break;
    //            }
    //        }
    //    }
    //
    //    public execute() : void {
    //        switch (this.queryType) {
    //            case QueryTypes.START_ANIM :
    //                this._startAnimation();
    //                break;
    //            case QueryTypes.PAUSE_ANIM :
    //                this._pauseAnimation();
    //                break;
    //            case QueryTypes.UNPAUSE_ANIM :
    //                this._unpauseAnimation();
    //                break;
    //            case QueryTypes.STOP_ANIM :
    //                this._stopAnimation();
    //                break;
    //            default :
    //                console.log("Default case");
    //                break;
    //        }
    //    }
    //
    //    private _startAnimation() {
    //        var keys = this.target.getKeys();
    //        this.client.scenes[this.sceneID].beginAnimation(this.animTarget,
    //            keys[0].frame,
    //            keys[keys.length - 1].frame,
    //            true);
    //    }
    //
    //    private _pauseAnimation() {
    //        this.currentFrame = this.target.currentFrame;
    //        this.client.scenes[this.sceneID].stopAnimation(this.animTarget);
    //    }
    //
    //    private _unpauseAnimation() {
    //        var keys = this.target.getKeys();
    //        this.client.scenes[this.sceneID].beginAnimation(this.animTarget,
    //            this.currentFrame,
    //            keys[keys.length - 1].frame,
    //            true);
    //    }
    //
    //    private _stopAnimation() {
    //        this.currentFrame = 0;
    //        this.client.scenes[this.sceneID].stopAnimation(this.animTarget);
    //    }
    //
    //    private _findAnimTarget() : void {
    //        switch(this.animTargetType) {
    //            case AnimTargetTypes.MESH:
    //                this.animTarget = this.client.scenes[this.sceneID].getMeshByName(this.animTargetName);
    //                break;
    //            default:
    //                break;
    //        }
    //        this.copyOfTargetAnimations = this.animTarget.animations.slice();
    //    }
    //}
    var BabylonInspectorClient = (function (_super) {
        __extends(BabylonInspectorClient, _super);
        //CONSTRUCTOR
        /**
         * Consctructor
         */
        function BabylonInspectorClient() {
            _super.call(this, "babylonInspector"); // Name
            this._ready = true; // No need to wait
            this.id = "BABYLONINSPECTOR";
            this._dataGenerator = new DataGenerator();
        }
        /**
         * Return unique id for the plugin.
         * @returns {string}
         */
        BabylonInspectorClient.prototype.getID = function () {
            return this.id;
        };
        /**
        * Refresh client : sens BABYLON Engine again.
        * Override this method with cleanup work that needs to happen
        * as the user switches between clients on the dashboard.
        */
        BabylonInspectorClient.prototype.refresh = function () {
            if (typeof BABYLON !== 'undefined') {
                if (this.engine) {
                    this._sendScenesData();
                }
                else {
                    this.engine = this._getBabylonEngine();
                    this.scenes = this.engine.scenes;
                    this._sendScenesData();
                }
            }
        };
        /**
         * Start the clientside code : initilization etc
         */
        BabylonInspectorClient.prototype.startClientSide = function () {
            if (typeof BABYLON !== 'undefined' && !BABYLON.Engine.isSupported()) {
            }
            else {
                //document.addEventListener("DOMContentLoaded", () => {
                this.engine = this._getBabylonEngine();
                if (this.engine) {
                    this.scenes = this.engine.scenes;
                    this.refresh();
                }
            }
        };
        /**
         * Handle messages received from the dashboard, on the client.
         * Then, send data back to dashboard.
         * Received objects must follow pattern :
         * {
         *  type : type of the query
         *  data : data of the query
         * }
         */
        BabylonInspectorClient.prototype.onRealtimeMessageReceivedFromDashboardSide = function (receivedObject) {
            switch (receivedObject.queryType) {
                case VORLON.QueryTypes.SPOT_MESH:
                case VORLON.QueryTypes.UNSPOT_MESH:
                    new SpotMeshQuery(this, receivedObject).execute();
                    break;
                //case QueryTypes.START_ANIM :
                //case QueryTypes.PAUSE_ANIM :
                //case QueryTypes.UNPAUSE_ANIM :
                //case QueryTypes.STOP_ANIM :
                //    new AnimQuery(this, receivedObject).execute();
                //    break;
                case VORLON.QueryTypes.TURN_OFF_LIGHT:
                case VORLON.QueryTypes.TURN_ON_LIGHT:
                    new SwitchLightQuery(this, receivedObject).execute();
                    break;
                case VORLON.QueryTypes.DISPLAY_MESH:
                case VORLON.QueryTypes.HIDE_MESH:
                    new ToggleMeshVisibilityQuery(this, receivedObject).execute();
                    break;
                case VORLON.QueryTypes.DISPLAY_MESH_GIZMO:
                case VORLON.QueryTypes.HIDE_MESH_GIZMO:
                    new GizmoOnMeshQuery(this, receivedObject).execute();
                    break;
                default:
                    break;
            }
        };
        //TOOLS
        /**
         * Find and return a mesh by scene ID and mesh name.
         * @param meshName
         * @param sceneID
         * @returns {any}
         * @private
         */
        BabylonInspectorClient.prototype._findMesh = function (meshName, sceneID) {
            if (typeof BABYLON !== 'undefined') {
                var id = +sceneID;
                var scene = this.engine.scenes[id];
                var mesh = scene.getMeshByName(meshName);
                return mesh;
            }
            return null;
        };
        /**
         * Send all data about the scenes
         * @private
         */
        BabylonInspectorClient.prototype._sendScenesData = function () {
            if (typeof BABYLON !== 'undefined' && this.scenes) {
                var scenesData = this._dataGenerator.generateScenesData(this.scenes);
                this.sendToDashboard({
                    messageType: 'SCENES_DATA',
                    data: scenesData,
                    clientURL: window.location.href
                });
            }
        };
        /**
         * Loop on all objects to fetch BABYLON Engine object.
         * @private
         */
        BabylonInspectorClient.prototype._getBabylonEngine = function () {
            for (var member in window) {
                if (typeof BABYLON !== 'undefined' && window[member] instanceof BABYLON.Engine) {
                    return window[member];
                }
            }
            return null;
        };
        return BabylonInspectorClient;
    }(VORLON.ClientPlugin));
    VORLON.BabylonInspectorClient = BabylonInspectorClient;
    /**
     * Register the plugin with vorlon core
     */
    VORLON.Core.RegisterClientPlugin(new BabylonInspectorClient());
})(VORLON || (VORLON = {}));
