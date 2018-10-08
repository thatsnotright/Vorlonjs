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
    /**
     * Represents a node in a tree.
     * Composed of a div wrapper that can have classes :
     *   tree-node : always, represents the type TreeNodeHTMLElement
     *   tree-node-with-children : if element has children
     *   tree-node-folded : if the node is folded, ie its children are hidden
     *   tree-node-hidden : if the node is hidden, ie its parent is folded
     * In the wrapper div, we have :
     *   dropDownButton : if the node has children, allows to fold and unfold children
     *      when user clicks on it
     *   content : the content to be displayed
     *   features : optionnal features
     */
    var TreeNodeHTMLElement = (function () {
        //CONSTRUCTOR
        function TreeNodeHTMLElement(dashboard, contentValue) {
            //TOOLS
            this._prepend = function (parent, child) {
                parent.insertBefore(child, parent.firstChild);
            };
            this.dashboard = dashboard;
            this.children = [];
            this.wrapper = document.createElement('div');
            this.wrapper.className = 'tree-node tree-node-hidden tree-node-folded';
            this.content = document.createElement('div');
            this.content.className = 'tree-node-content';
            this.content.innerHTML = contentValue;
            this.wrapper.appendChild(this.content);
            this.features = document.createElement('div');
            this.features.className = 'tree-node-features';
            this.wrapper.appendChild(this.features);
            this.hasChildren = false;
            this.isFolded = true;
            this.isHidden = true;
        }
        //REQUESTS
        /**
         * Add a child to the node.
         * @param child
         */
        TreeNodeHTMLElement.prototype.addChild = function (child) {
            if (!this.hasChildren) {
                this.hasChildren = true;
                this.createDropdownIcon();
                this._prepend(this.wrapper, this.dropDownButton);
                this.wrapper.className += ' tree-node-with-children';
            }
            this.wrapper.appendChild(child.wrapper);
            this.children.push(child);
            child.parent = this;
        };
        /**
         * Add a feature (a button, image or whatever)
         * @param feature
         */
        TreeNodeHTMLElement.prototype.addFeature = function (feature) {
            this.features.appendChild(feature);
        };
        /**
         * Create a dropdown icon with event listener on click.
         * @returns {any}
         * @private
         */
        TreeNodeHTMLElement.prototype.createDropdownIcon = function () {
            var _this = this;
            var dropDown = document.createElement('div');
            dropDown.innerHTML = '+';
            dropDown.className = 'tree-node-button folded-button';
            dropDown.addEventListener('click', function () {
                if (_this.isFolded) {
                    dropDown.innerHTML = '-';
                    _this.unfold();
                }
                else {
                    dropDown.innerHTML = '+';
                    _this.fold();
                }
            });
            this.dropDownButton = dropDown;
        };
        /**
         * Fold node
         */
        TreeNodeHTMLElement.prototype.fold = function () {
            if (this.isFolded) {
                return;
            }
            this.wrapper.className += " tree-node-folded";
            this.isFolded = true;
            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i];
                child.hide();
            }
        };
        /**
         * Hide node
         */
        TreeNodeHTMLElement.prototype.hide = function () {
            if (this.isHidden) {
                return;
            }
            this.isHidden = true;
            this.wrapper.className += ' tree-node-hidden';
        };
        /**
         * Unhide node
         */
        TreeNodeHTMLElement.prototype.unhide = function () {
            if (!this.isHidden) {
                return;
            }
            this.isHidden = false;
            this.wrapper.classList.remove('tree-node-hidden');
        };
        /**
         * Unfold node
         */
        TreeNodeHTMLElement.prototype.unfold = function () {
            if (!this.isFolded) {
                return;
            }
            this.wrapper.classList.remove('tree-node-folded');
            this.isFolded = false;
            for (var i = 0; i < this.children.length; ++i) {
                var child = this.children[i];
                child.unhide();
            }
        };
        return TreeNodeHTMLElement;
    }());
    /**
     * Tree node elements with a type represented by an small icon
     */
    var TypeTreeNodeHTMLElement = (function (_super) {
        __extends(TypeTreeNodeHTMLElement, _super);
        function TypeTreeNodeHTMLElement(dashboard, content, type) {
            _super.call(this, dashboard, content);
            this.type = type;
            this.createAndAddTypeIcon(this.type);
        }
        /**
         * Create a type icon, its background is the image found at
         * imgURL.
         */
        TypeTreeNodeHTMLElement.prototype.createAndAddTypeIcon = function (iconType) {
            var typeIcon = document.createElement('div');
            typeIcon.className = 'tree-node-type-icon tree-node-type-icon-' + iconType;
            this.icon = typeIcon;
            this._prepend(this.wrapper, this.icon);
        };
        return TypeTreeNodeHTMLElement;
    }(TreeNodeHTMLElement));
    /**
     * Node to display a property.
     * Constructor must be provided with property name and value.
     * Node content will be <span> property name : </span> property value
     */
    var PropertyTreeNodeHTMLElement = (function (_super) {
        __extends(PropertyTreeNodeHTMLElement, _super);
        function PropertyTreeNodeHTMLElement(dashboard, propertyName, propertyValue) {
            _super.call(this, dashboard, "<span>" + propertyName + " : " + "</span>" + propertyValue);
        }
        return PropertyTreeNodeHTMLElement;
    }(TreeNodeHTMLElement));
    /**
     * Node to display a color property. Property with color sample added
     * in features.
     */
    var ColorPropertyTreeNodeHTMLElement = (function (_super) {
        __extends(ColorPropertyTreeNodeHTMLElement, _super);
        function ColorPropertyTreeNodeHTMLElement(dashboard, propertyName, propertyValue) {
            _super.call(this, dashboard, propertyName, propertyValue);
            var colorSample = this._createColorSample(propertyValue);
            this.addFeature(colorSample);
        }
        /**
         * Create a color sample which background colored in colorHex.
         * @param colorHex
         * @returns {any}
         * @private
         */
        ColorPropertyTreeNodeHTMLElement.prototype._createColorSample = function (colorHex) {
            var colorSample = document.createElement('div');
            colorSample.className = "tree-node-color-sample";
            if (colorHex) {
                colorSample.style.backgroundColor = colorHex;
                colorSample.style.borderColor = this._isClearColor(colorHex) ? '#000000' : '#ffffff';
            }
            return colorSample;
        };
        /**
         * True if colorHex is a clear color
         * @param colorHex
         * @returns {boolean}
         * @private
         */
        ColorPropertyTreeNodeHTMLElement.prototype._isClearColor = function (colorHex) {
            return (colorHex.charAt(1) == 'f' || colorHex.charAt(1) == 'F')
                && (colorHex.charAt(3) == 'f' || colorHex.charAt(3) == 'F')
                && (colorHex.charAt(5) == 'f' || colorHex.charAt(5) == 'F');
        };
        return ColorPropertyTreeNodeHTMLElement;
    }(PropertyTreeNodeHTMLElement));
    /**
     * Node to display a texture.
     * Texture thumbnail which displays texture on click added to features.
     */
    var TextureUrlPropertyTreeNodeHTMLElement = (function (_super) {
        __extends(TextureUrlPropertyTreeNodeHTMLElement, _super);
        function TextureUrlPropertyTreeNodeHTMLElement(dashboard, textureURL, completeURL) {
            _super.call(this, dashboard, 'url', textureURL);
            this.completeURL = completeURL;
            this.imageDisplayed = false;
            var imageViewer = this._createImageViewer();
            this.addFeature(imageViewer);
        }
        /**
         * Create texture thumbnail that allows to view texture on click.
         * @returns {any}
         * @private
         */
        TextureUrlPropertyTreeNodeHTMLElement.prototype._createImageViewer = function () {
            var _this = this;
            var viewerThumbnail = document.createElement('div');
            viewerThumbnail.className = 'tree-node-texture-thumbnail';
            viewerThumbnail.style.backgroundImage = ('url(' + this.completeURL + ')');
            var imageView = document.createElement('div');
            imageView.className = 'tree-node-texture-view';
            imageView.style.backgroundImage = ('url(' + this.completeURL + ')');
            viewerThumbnail.addEventListener('mouseover', function () {
                //if image was displayed, hide it
                if (_this.imageDisplayed) {
                    return;
                }
                //else, display it
                _this.imageDisplayed = true;
                _this.dashboard.displayer.innerHTML = "";
                _this.dashboard.displayer.style.display = 'block';
                _this.dashboard.displayer.appendChild(imageView);
            });
            viewerThumbnail.addEventListener('mouseout', function () {
                //if image was displayed, hide it
                if (!_this.imageDisplayed) {
                    return;
                }
                _this.imageDisplayed = false;
                _this.dashboard.displayer.style.display = 'none';
                _this.dashboard.displayer.innerHTML = "";
            });
            //imageView.addEventListener('click', () => {
            //    this.imageDisplayed = false;
            //    this.dashboard.displayer.innerHTML = "";
            //});
            return viewerThumbnail;
        };
        return TextureUrlPropertyTreeNodeHTMLElement;
    }(PropertyTreeNodeHTMLElement));
    var LightTreeNodeHTMLElement = (function (_super) {
        __extends(LightTreeNodeHTMLElement, _super);
        function LightTreeNodeHTMLElement(dashboard, lightName, isEnabled) {
            _super.call(this, dashboard, lightName);
            this.lightName = lightName;
            this.lightIsOn = isEnabled;
            var switchBtn = this._createSwitch();
            this.addFeature(switchBtn);
        }
        /**
         * Create the on/off switch
         * @returns {any}
         * @private
         */
        LightTreeNodeHTMLElement.prototype._createSwitch = function () {
            var _this = this;
            var switchBtn = document.createElement('div');
            switchBtn.className = 'tree-node-light-switch clickable';
            if (this.lightIsOn) {
                switchBtn.innerHTML = 'ON';
                switchBtn.className += ' tree-node-light-switch-on';
            }
            else {
                switchBtn.innerHTML = 'OFF';
                switchBtn.className += ' tree-node-light-switch-off';
            }
            switchBtn.addEventListener('click', function () {
                var data = {
                    lightName: _this.lightName,
                    sceneID: (_this.parent.parent).sceneID
                };
                if (_this.lightIsOn) {
                    _this.lightIsOn = false;
                    switchBtn.innerHTML = 'OFF';
                    switchBtn.classList.remove('tree-node-light-switch-on');
                    switchBtn.className += ' tree-node-light-switch-off';
                    _this.dashboard.queryToClient(VORLON.QueryTypes.TURN_OFF_LIGHT, data);
                }
                else {
                    _this.lightIsOn = true;
                    switchBtn.innerHTML = 'ON';
                    switchBtn.classList.remove('tree-node-light-switch-off');
                    switchBtn.className += ' tree-node-light-switch-on';
                    _this.dashboard.queryToClient(VORLON.QueryTypes.TURN_ON_LIGHT, data);
                }
            });
            return switchBtn;
        };
        return LightTreeNodeHTMLElement;
    }(TreeNodeHTMLElement));
    /**
     * Node to display a scene.
     * Contains the scene ID as an attribute
     */
    var SceneTreeNodeHTMLElement = (function (_super) {
        __extends(SceneTreeNodeHTMLElement, _super);
        //CONSTRUCTOR
        function SceneTreeNodeHTMLElement(dashboard, sceneID) {
            _super.call(this, dashboard, 'Scene n° ' + sceneID);
            this.sceneID = sceneID;
        }
        return SceneTreeNodeHTMLElement;
    }(TreeNodeHTMLElement));
    /**
     * Node to display a mesh.
     */
    var MeshTreeNodeHTMLElement = (function (_super) {
        __extends(MeshTreeNodeHTMLElement, _super);
        //CONSTRUCTOR
        function MeshTreeNodeHTMLElement(dashboard, meshName, visible) {
            _super.call(this, dashboard, meshName);
            this.meshName = meshName;
            this.meshIsSpotted = false;
            this.meshIsVisible = visible;
            this.gizmosVisible = false;
            var spotMeshButton = this._createSpotMeshButton();
            this.addFeature(spotMeshButton);
            var displaySwitch = this._createSwitch();
            this.addFeature(displaySwitch);
            var gizmosSwitch = this._createGizmoSwitch();
            this.addFeature(gizmosSwitch);
        }
        //REQUESTS
        //TOOLS
        /**
         * Create a switch to spot the mesh in the scene
         * @returns {any}
         * @private
         */
        MeshTreeNodeHTMLElement.prototype._createSpotMeshButton = function () {
            var _this = this;
            var spotMeshCheckbox = document.createElement('div');
            spotMeshCheckbox.innerHTML = 'Spot mesh';
            var cb = document.createElement('div');
            cb.className = "tree-node-features-element tree-node-spot-mesh-button tree-node-spot-mesh-button-off clickable";
            cb.addEventListener('click', function () {
                var data = {
                    meshName: _this.meshName,
                    sceneID: (_this.parent.parent).sceneID
                };
                if (_this.meshIsSpotted) {
                    _this.meshIsSpotted = false;
                    cb.classList.remove('tree-node-spot-mesh-button-on');
                    cb.className += ' tree-node-spot-mesh-button-off';
                    _this.dashboard.queryToClient(VORLON.QueryTypes.UNSPOT_MESH, data);
                }
                else {
                    _this.meshIsSpotted = true;
                    cb.classList.remove('tree-node-spot-mesh-button-off');
                    cb.className += ' tree-node-spot-mesh-button-on';
                    _this.dashboard.queryToClient(VORLON.QueryTypes.SPOT_MESH, data);
                }
            });
            spotMeshCheckbox.appendChild(cb);
            return spotMeshCheckbox;
        };
        /**
         * Create a switch to hide/display the mesh
         * @returns {any}
         * @private
         */
        MeshTreeNodeHTMLElement.prototype._createSwitch = function () {
            var _this = this;
            var switchBtn = document.createElement('div');
            switchBtn.className = 'tree-node-mesh-switch';
            if (this.meshIsVisible) {
                switchBtn.innerHTML = 'ON';
                switchBtn.className += 'tree-node-features-element tree-node-mesh-switch-on clickable';
            }
            else {
                switchBtn.innerHTML = 'OFF';
                switchBtn.className += ' tree-node-mesh-switch-off';
            }
            switchBtn.addEventListener('click', function () {
                var data = {
                    meshName: _this.meshName,
                    sceneID: (_this.parent.parent).sceneID
                };
                if (_this.meshIsVisible) {
                    _this.meshIsVisible = false;
                    switchBtn.innerHTML = 'OFF';
                    switchBtn.classList.remove('tree-node-mesh-switch-on');
                    switchBtn.className += ' tree-node-mesh-switch-off';
                    _this.dashboard.queryToClient(VORLON.QueryTypes.HIDE_MESH, data);
                }
                else {
                    _this.meshIsVisible = true;
                    switchBtn.innerHTML = 'ON';
                    switchBtn.classList.remove('tree-node-mesh-switch-off');
                    switchBtn.className += ' tree-node-mesh-switch-on';
                    _this.dashboard.queryToClient(VORLON.QueryTypes.DISPLAY_MESH, data);
                }
            });
            return switchBtn;
        };
        /**
         * Create a switch than displays or hide the axes (gizmos) of the mesh..
         * @returns {any}
         * @private
         */
        MeshTreeNodeHTMLElement.prototype._createGizmoSwitch = function () {
            var _this = this;
            var gizmosBtn = document.createElement('div');
            gizmosBtn.className = 'tree-node-features-element tree-node-mesh-gizmo clickable';
            gizmosBtn.innerHTML = 'gizmo off';
            gizmosBtn.className += ' tree-node-mesh-gizmo-off';
            gizmosBtn.addEventListener('click', function () {
                var data = {
                    meshName: _this.meshName,
                    sceneID: (_this.parent.parent).sceneID
                };
                if (_this.gizmosVisible) {
                    _this.gizmosVisible = false;
                    gizmosBtn.innerHTML = 'gizmo off';
                    gizmosBtn.classList.remove('tree-node-mesh-gizmo-on');
                    gizmosBtn.className += ' tree-node-mesh-gizmo-off';
                    _this.dashboard.queryToClient(VORLON.QueryTypes.HIDE_MESH_GIZMO, data);
                }
                else {
                    _this.gizmosVisible = true;
                    gizmosBtn.innerHTML = 'gizmo on';
                    gizmosBtn.classList.remove('tree-node-mesh-gizmo-off');
                    gizmosBtn.className += ' tree-node-mesh-gizmo-on';
                    _this.dashboard.queryToClient(VORLON.QueryTypes.DISPLAY_MESH_GIZMO, data);
                }
            });
            return gizmosBtn;
        };
        return MeshTreeNodeHTMLElement;
    }(TreeNodeHTMLElement));
    /**
     * Node to display an animation.
     * Features : play/pause and stop buttons (disabled).
     */
    var AnimationTreeNodeHTMLElement = (function (_super) {
        __extends(AnimationTreeNodeHTMLElement, _super);
        function AnimationTreeNodeHTMLElement(dashboard, animName, targetType, stopped) {
            _super.call(this, dashboard, animName);
            this.animName = animName;
            this.targetType = targetType;
            this.animationIsStopped = stopped;
            this.animationIsPaused = false;
            this.animationIsStarted = !stopped;
            //this._createPlayStopIcons();
        }
        AnimationTreeNodeHTMLElement.prototype._createPlayStopIcons = function () {
            var _this = this;
            //Create buttons and set appropriate class names
            this.playBtn = document.createElement('button');
            this.stopBtn = document.createElement('button');
            if (this.animationIsStarted) {
                this.playBtn.className = 'tree-node-features-element tree-node-animation-button tree-node-animation-button-pause';
                this.stopBtn.className = 'tree-node-features-element tree-node-animation-button tree-node-animation-button-stop';
            }
            else {
                this.playBtn.className = 'tree-node-features-element tree-node-animation-button tree-node-animation-button-play';
                this.stopBtn.className = 'tree-node-features-element tree-node-animation-button tree-node-animation-button-stop-pressed';
            }
            // Event listeners
            this.playBtn.addEventListener('click', function () {
                if (!_this.animationIsStarted) {
                    _this._startAnimation();
                }
                else if (_this.animationIsPaused) {
                    _this.unpauseAnimation();
                }
                else {
                    _this._pauseAnimation();
                }
            });
            this.stopBtn.addEventListener('click', function () {
                if (!_this.animationIsStarted) {
                    return;
                }
                _this._stopAnimation();
            });
            // Add to features list
            this.addFeature(this.playBtn);
            this.addFeature(this.stopBtn);
        };
        AnimationTreeNodeHTMLElement.prototype._startAnimation = function () {
            if (!this.animationIsStopped) {
                return;
            }
            this.animationIsStarted = true;
            this.animationIsStopped = false;
            //play-pause button  has icon pause
            this.playBtn.classList.remove('tree-node-animation-button-play');
            this.playBtn.className += ' tree-node-animation-button-pause';
            // stop button has icon unpressed
            this.stopBtn.classList.remove('tree-node-animation-button-stop-pressed');
            this.stopBtn.className += ' tree-node-animation-button-stop';
            this.dashboard.queryToClient(VORLON.QueryTypes.START_ANIM, {
                animName: this.animName,
                animTargetType: this.targetType,
                animTargetName: this._getTargetName(),
                sceneID: this._getSceneID()
            });
        };
        AnimationTreeNodeHTMLElement.prototype._pauseAnimation = function () {
            if (this.animationIsPaused || this.animationIsStopped) {
                return;
            }
            this.animationIsPaused = true;
            //play-pause button  has icon play
            this.playBtn.classList.remove('tree-node-animation-button-pause');
            this.playBtn.className += ' tree-node-animation-button-play';
            this.dashboard.queryToClient(VORLON.QueryTypes.PAUSE_ANIM, {
                animName: this.animName,
                animTargetType: this.targetType,
                animTargetName: this._getTargetName(),
                sceneID: this._getSceneID()
            });
        };
        AnimationTreeNodeHTMLElement.prototype.unpauseAnimation = function () {
            if (!this.animationIsPaused) {
                return;
            }
            this.animationIsPaused = false;
            //play-pause button  has icon pause
            this.playBtn.classList.remove('tree-node-animation-button-play');
            this.playBtn.className += ' tree-node-animation-button-pause';
            this.dashboard.queryToClient(VORLON.QueryTypes.UNPAUSE_ANIM, {
                animName: this.animName,
                animTargetType: this.targetType,
                animTargetName: this._getTargetName(),
                sceneID: this._getSceneID()
            });
        };
        AnimationTreeNodeHTMLElement.prototype._stopAnimation = function () {
            if (!this.animationIsStarted) {
                return;
            }
            this.animationIsStarted = false;
            this.animationIsStopped = true;
            this.animationIsPaused = false;
            //play-pause button has icon play
            this.playBtn.classList.remove('tree-node-animation-button-pause');
            this.playBtn.className += ' tree-node-animation-button-play';
            //stop button has icon stop pressed
            this.stopBtn.classList.remove('tree-node-animation-button-stop');
            this.stopBtn.className += ' tree-node-animation-button-stop-pressed';
            this.dashboard.queryToClient(VORLON.QueryTypes.STOP_ANIM, {
                animName: this.animName,
                animTargetType: this.targetType,
                animTargetName: this._getTargetName(),
                sceneID: this._getSceneID()
            });
        };
        /**
         * Find the name of the object targeted by the animation.
         * @returns {string}
         * @private
         */
        AnimationTreeNodeHTMLElement.prototype._getTargetName = function () {
            var targetName;
            switch (this.targetType) {
                case VORLON.AnimTargetTypes.MESH:
                    targetName = (this.parent.parent).meshName;
                    break;
                default:
                    break;
            }
            return targetName;
        };
        AnimationTreeNodeHTMLElement.prototype._getSceneID = function () {
            var sceneID;
            switch (this.targetType) {
                case VORLON.AnimTargetTypes.MESH:
                    sceneID = (this.parent.parent.parent.parent).sceneID;
                    break;
                default:
                    break;
            }
            return sceneID;
        };
        return AnimationTreeNodeHTMLElement;
    }(TreeNodeHTMLElement));
    /**
     * Class that generates the tree of data.
     */
    var DataTreeGenerator = (function () {
        //CONSTRCUTOR
        function DataTreeGenerator(dashboard) {
            this.dashboard = dashboard;
        }
        /**
         * Generate a material node.
         * @param materialData
         * @param clientURL
         * @returns {VORLON.PropertyTreeNodeHTMLElement}
         * @private
         */
        DataTreeGenerator.prototype._generateMaterialNode = function (materialData, clientURL) {
            var materialNode = new PropertyTreeNodeHTMLElement(this.dashboard, "material", "");
            {
                var materialPropertyNode;
                materialPropertyNode = new ColorPropertyTreeNodeHTMLElement(this.dashboard, "diffuseColor", materialData.diffuseColor);
                materialNode.addChild(materialPropertyNode);
                materialPropertyNode = new ColorPropertyTreeNodeHTMLElement(this.dashboard, "ambientColor", materialData.ambientColor);
                materialNode.addChild(materialPropertyNode);
                materialPropertyNode = new ColorPropertyTreeNodeHTMLElement(this.dashboard, "emissiveColor", materialData.emissiveColor);
                materialNode.addChild(materialPropertyNode);
                materialPropertyNode = new ColorPropertyTreeNodeHTMLElement(this.dashboard, "specularColor", materialData.specularColor);
                materialNode.addChild(materialPropertyNode);
                if (materialData.diffuseTexture) {
                    materialPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "diffuseTexture", materialData.diffuseTexture.name);
                    {
                        var texturePropertyNode;
                        texturePropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "name", materialData.diffuseTexture.name);
                        materialPropertyNode.addChild(texturePropertyNode);
                        texturePropertyNode = new TextureUrlPropertyTreeNodeHTMLElement(this.dashboard, materialData.diffuseTexture.url, clientURL + materialData.diffuseTexture.url);
                        materialPropertyNode.addChild(texturePropertyNode);
                    }
                    materialNode.addChild(materialPropertyNode);
                }
            }
            return materialNode;
        };
        /**
         * Generate an animation node
         * @param animations
         * @returns {VORLON.PropertyTreeNodeHTMLElement}
         * @private
         */
        DataTreeGenerator.prototype._generateAnimationsNode = function (animations) {
            var _this = this;
            var allAnimationsNode = new PropertyTreeNodeHTMLElement(this.dashboard, "animations", "");
            animations.forEach(function (anim) {
                var animNode = new AnimationTreeNodeHTMLElement(_this.dashboard, anim.name, VORLON.AnimTargetTypes.MESH, anim.stopped);
                {
                    var animPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "name", anim.name);
                    animNode.addChild(animPropertyNode);
                    animPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "target property", anim.targetProperty);
                    animNode.addChild(animPropertyNode);
                    animPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "frame per second", anim.framePerSecond);
                    animNode.addChild(animPropertyNode);
                    animPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "running", anim.stopped);
                    animNode.addChild(animPropertyNode);
                    animPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "begin frame", anim.beginFrame);
                    animNode.addChild(animPropertyNode);
                    animPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "end frame", anim.endFrame);
                    animNode.addChild(animPropertyNode);
                }
                allAnimationsNode.addChild(animNode);
            });
            return allAnimationsNode;
        };
        /**
         * Generate the tree of meshes
         * @param meshesData
         * @param clientURL
         * @returns {VORLON.TypeTreeNodeHTMLElement}
         */
        DataTreeGenerator.prototype.generateMeshesTree = function (meshesData, clientURL) {
            var _this = this;
            //Generate node containing all meshes
            var allMeshesNode = new TypeTreeNodeHTMLElement(this.dashboard, "Meshes", "mesh");
            // Generate one node for each mesh
            meshesData.forEach(function (meshData) {
                var meshNode = new MeshTreeNodeHTMLElement(_this.dashboard, meshData.name, meshData.isVisible);
                {
                    // Generate one node for each property
                    var propertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "name", meshData.name);
                    meshNode.addChild(propertyNode);
                    propertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "position", "(" + meshData.position.x + ", " + meshData.position.y + ", " + meshData.position.z + ")");
                    meshNode.addChild(propertyNode);
                    propertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "rotation", "(" + meshData.rotation.x + ", " + meshData.rotation.y + ", " + meshData.rotation.z + ")");
                    meshNode.addChild(propertyNode);
                    propertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "scaling", "(" + meshData.scaling.x + ", " + meshData.scaling.y + ", " + meshData.scaling.z + ")");
                    meshNode.addChild(propertyNode);
                    propertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "bounding box center", "(" + meshData.boundingBoxCenter.x + ", " + meshData.boundingBoxCenter.y + ", " + meshData.boundingBoxCenter.z + ")");
                    meshNode.addChild(propertyNode);
                    if (meshData.animations) {
                        propertyNode = _this._generateAnimationsNode(meshData.animations);
                        meshNode.addChild(propertyNode);
                    }
                    if (meshData.material) {
                        propertyNode = _this._generateMaterialNode(meshData.material, clientURL);
                        meshNode.addChild(propertyNode);
                    }
                    //TODO factorise avec plus haut
                    if (meshData.multiMaterial) {
                        propertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "multi material", "");
                        var subMaterialNode;
                        meshData.multiMaterial.subMaterials.forEach(function (subMaterialData, index) {
                            subMaterialNode = _this._generateMaterialNode(subMaterialData, clientURL);
                            propertyNode.addChild(subMaterialNode);
                        });
                        meshNode.addChild(propertyNode);
                    }
                }
                allMeshesNode.addChild(meshNode);
            });
            return allMeshesNode;
        };
        /**
         * Generate the tree of textures
         * @param texturesData
         * @param clientURL
         * @returns {VORLON.TreeNodeHTMLElement}
         */
        DataTreeGenerator.prototype.generateTexturesTree = function (texturesData, clientURL) {
            var _this = this;
            var allTexturesNode = new TreeNodeHTMLElement(this.dashboard, "Textures");
            texturesData.forEach(function (txtrData) {
                var txtrNode = new TreeNodeHTMLElement(_this.dashboard, txtrData.name);
                {
                    var texturePropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "name", txtrData.name);
                    txtrNode.addChild(texturePropertyNode);
                    texturePropertyNode = new TextureUrlPropertyTreeNodeHTMLElement(_this.dashboard, txtrData.url, clientURL + txtrData.url);
                    txtrNode.addChild(texturePropertyNode);
                }
                allTexturesNode.addChild(txtrNode);
            });
            return allTexturesNode;
        };
        /**
         * Generate the tree of the active camera.
         * @param camData
         * @returns {VORLON.TypeTreeNodeHTMLElement}
         */
        DataTreeGenerator.prototype.generateActiveCameraNode = function (camData) {
            var camNode = new TypeTreeNodeHTMLElement(this.dashboard, "Active camera", "camera");
            var camPropertyNode;
            camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "name", camData.name);
            camNode.addChild(camPropertyNode);
            camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "type", camData.type);
            camNode.addChild(camPropertyNode);
            camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "mode", camData.mode);
            camNode.addChild(camPropertyNode);
            camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "layer mask", camData.layerMask);
            camNode.addChild(camPropertyNode);
            camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "position", "(" + camData.position.x + ", " + camData.position.y + ", " + camData.position.z + ")");
            camNode.addChild(camPropertyNode);
            if (camData.type == 'FreeCamera') {
                camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "speed", camData.speed);
                camNode.addChild(camPropertyNode);
                camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "rotation", "(" + camData.rotation.x + ", " + camData.rotation.y + ", " + camData.rotation.z + ")");
                camNode.addChild(camPropertyNode);
            }
            if (camData.type == 'ArcRotateCamera') {
                camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "alpha", camData.alpha);
                camNode.addChild(camPropertyNode);
                camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "beta", camData.beta);
                camNode.addChild(camPropertyNode);
                camPropertyNode = new PropertyTreeNodeHTMLElement(this.dashboard, "radius", camData.radius);
                camNode.addChild(camPropertyNode);
            }
            if (camData.animations) {
                camPropertyNode = this._generateAnimationsNode(camData.animations);
                camNode.addChild(camPropertyNode);
            }
            return camNode;
        };
        /**
         * Generate the tree of cameras.
         * @param camerasData
         * @returns {VORLON.TypeTreeNodeHTMLElement}
         */
        DataTreeGenerator.prototype.generateCamerasTree = function (camerasData) {
            var _this = this;
            var allCamerasNode = new TypeTreeNodeHTMLElement(this.dashboard, "Cameras", "camera");
            camerasData.forEach(function (camData) {
                var camNode = new TreeNodeHTMLElement(_this.dashboard, camData.name);
                {
                    var camPropertyNode;
                    camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "name", camData.name);
                    camNode.addChild(camPropertyNode);
                    camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "type", camData.type);
                    camNode.addChild(camPropertyNode);
                    camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "mode", camData.mode);
                    camNode.addChild(camPropertyNode);
                    camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "layer mask", camData.layerMask);
                    camNode.addChild(camPropertyNode);
                    camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "position", "(" + camData.position.x + ", " + camData.position.y + ", " + camData.position.z + ")");
                    camNode.addChild(camPropertyNode);
                    if (camData.type == 'FreeCamera') {
                        camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "speed", camData.speed);
                        camNode.addChild(camPropertyNode);
                        camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "rotation", "(" + camData.rotation.x + ", " + camData.rotation.y + ", " + camData.rotation.z + ")");
                        camNode.addChild(camPropertyNode);
                    }
                    if (camData.type == 'ArcRotateCamera') {
                        camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "alpha", camData.alpha);
                        camNode.addChild(camPropertyNode);
                        camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "beta", camData.beta);
                        camNode.addChild(camPropertyNode);
                        camPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "radius", camData.radius);
                        camNode.addChild(camPropertyNode);
                    }
                    if (camData.animations) {
                        camPropertyNode = _this._generateAnimationsNode(camData.animations);
                        camNode.addChild(camPropertyNode);
                    }
                }
                allCamerasNode.addChild(camNode);
            });
            return allCamerasNode;
        };
        /**
         * Generate the tree of lights.
         * @param lightsData
         * @returns {VORLON.TypeTreeNodeHTMLElement}
         */
        DataTreeGenerator.prototype.generateLightsTree = function (lightsData) {
            var _this = this;
            var allLightsNode = new TypeTreeNodeHTMLElement(this.dashboard, "Lights", "light");
            lightsData.forEach(function (lightData) {
                var lightNode = new LightTreeNodeHTMLElement(_this.dashboard, lightData.name, lightData.isEnabled);
                {
                    var lightPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "name", lightData.name);
                    lightNode.addChild(lightPropertyNode);
                    lightPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "type", lightData.type);
                    lightNode.addChild(lightPropertyNode);
                    if (lightData.type != "HemisphericLight") {
                        lightPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "position", "(" + lightData.position.x + ", " + lightData.position.y + ", " + lightData.position.z + ")");
                        lightNode.addChild(lightPropertyNode);
                    }
                    lightPropertyNode = new ColorPropertyTreeNodeHTMLElement(_this.dashboard, "diffuse", lightData.diffuse);
                    lightNode.addChild(lightPropertyNode);
                    lightPropertyNode = new ColorPropertyTreeNodeHTMLElement(_this.dashboard, "specular", lightData.specular);
                    lightNode.addChild(lightPropertyNode);
                    lightPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "intensity", lightData.intensity);
                    lightNode.addChild(lightPropertyNode);
                    if (lightData.type == "HemisphericLight") {
                        lightPropertyNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "direction", "(" + lightData.direction.x + ", " + lightData.direction.y + ", " + lightData.direction.z + ")");
                        lightNode.addChild(lightPropertyNode);
                        lightPropertyNode = new ColorPropertyTreeNodeHTMLElement(_this.dashboard, "groundColor", lightData.groundColor);
                        lightNode.addChild(lightPropertyNode);
                    }
                }
                allLightsNode.addChild(lightNode);
            });
            return allLightsNode;
        };
        /**
         * Generate the tree of functions before render.
         * @param beforeRenderCallbacksData
         * @returns {VORLON.TreeNodeHTMLElement}
         */
        DataTreeGenerator.prototype.generateBeforeRenderCallbacksTree = function (beforeRenderCallbacksData) {
            var _this = this;
            var allBeforeRenderCallBacksNode = new TreeNodeHTMLElement(this.dashboard, 'functions registered before render');
            beforeRenderCallbacksData.forEach(function (fct, index) {
                var functionNode = new TreeNodeHTMLElement(_this.dashboard, index);
                {
                    var propertyFunctionNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "body", fct.body);
                    functionNode.addChild(propertyFunctionNode);
                }
                allBeforeRenderCallBacksNode.addChild(functionNode);
            });
            return allBeforeRenderCallBacksNode;
        };
        /**
         * Generate the tree of functions after render.
         * @param afterRenderCallbacksData
         * @returns {VORLON.TreeNodeHTMLElement}
         */
        DataTreeGenerator.prototype.generateAfterRenderCallbacksTree = function (afterRenderCallbacksData) {
            var _this = this;
            var allAfterRenderCallBacksNode = new TreeNodeHTMLElement(this.dashboard, 'functions registered after render');
            afterRenderCallbacksData.forEach(function (fct, index) {
                var functionNode = new TreeNodeHTMLElement(_this.dashboard, index);
                {
                    var propertyFunctionNode = new PropertyTreeNodeHTMLElement(_this.dashboard, "body", fct.body);
                    functionNode.addChild(propertyFunctionNode);
                }
                allAfterRenderCallBacksNode.addChild(functionNode);
            });
            return allAfterRenderCallBacksNode;
        };
        /**
         * Generate tree containging all data.
         * Extra curly brackets {} are added in order to render tree view in code.
         * @param scenesData
         * @returns {VORLON.TreeNodeHTMLElement}
         */
        DataTreeGenerator.prototype.generateScenesTree = function (scenesData, clientURL) {
            var _this = this;
            //Tree root
            var treeRoot = new TreeNodeHTMLElement(this.dashboard, "Scenes explorer");
            //Generate scene nodes
            scenesData.forEach(function (scene, index) {
                var sceneNode = new SceneTreeNodeHTMLElement(_this.dashboard, index);
                {
                    if (scene.activeCameraData) {
                        var activeCameraNode = _this.generateActiveCameraNode(scene.activeCameraData);
                        sceneNode.addChild(activeCameraNode);
                    }
                    if (scene.meshesData) {
                        var allMeshesNode = _this.generateMeshesTree(scene.meshesData, clientURL);
                        sceneNode.addChild(allMeshesNode);
                    }
                    if (scene.texturesData) {
                        var allTexturesNode = _this.generateTexturesTree(scene.texturesData, clientURL);
                        sceneNode.addChild(allTexturesNode);
                    }
                    if (scene.camerasData) {
                        var allCamerasNode = _this.generateCamerasTree(scene.camerasData);
                        sceneNode.addChild(allCamerasNode);
                    }
                    if (scene.lightsData) {
                        var allLightsNode = _this.generateLightsTree(scene.lightsData);
                        sceneNode.addChild(allLightsNode);
                    }
                    if (scene.beforeRenderCallbacksData) {
                        var allBeforeRenderCallbacksNode = _this.generateBeforeRenderCallbacksTree(scene.beforeRenderCallbacksData);
                        sceneNode.addChild(allBeforeRenderCallbacksNode);
                    }
                    if (scene.afterRenderCallbacksData) {
                        var allAfterRenderCallbacksNode = _this.generateAfterRenderCallbacksTree(scene.afterRenderCallbacksData);
                        sceneNode.addChild(allAfterRenderCallbacksNode);
                    }
                }
                treeRoot.addChild(sceneNode);
            });
            return treeRoot;
        };
        return DataTreeGenerator;
    }());
    var BabylonInspectorDashboard = (function (_super) {
        __extends(BabylonInspectorDashboard, _super);
        /**
         * Do any setup you need, call super to configure
         * the plugin with html and css for the dashboarde
         */
        function BabylonInspectorDashboard() {
            //     name   ,  html for dash   css for dash
            _super.call(this, "babylonInspector", "control.html", "control.css");
            this._ready = false;
            this.id = 'BABYLONINSPECTOR';
            this._dataTreeGenerator = new DataTreeGenerator(this);
            this.treeRoot = null;
        }
        /**
         * Return unique id for your plugin
         */
        BabylonInspectorDashboard.prototype.getID = function () {
            return this.id;
        };
        /**
         * When we get a message from the client, handle it
         */
        BabylonInspectorDashboard.prototype.onRealtimeMessageReceivedFromClientSide = function (receivedObject) {
            switch (receivedObject.messageType) {
                case 'SCENES_DATA':
                    var scenesData = receivedObject.data;
                    this._refreshTree(scenesData, receivedObject.clientURL);
                    break;
                default:
                    break;
            }
        };
        /**
         * Send a query to client of type queryType containing some data.
         * @param queryType
         * @param data
         */
        BabylonInspectorDashboard.prototype.queryToClient = function (queryType, data) {
            var message = {
                queryType: queryType,
                data: data
            };
            this.sendToClient(message);
        };
        /**
         * This code will run on the dashboard
         * Start dashboard code
         * uses _insertHtmlContentAsync to insert the control.html content
         * into the dashboard
         * @param div
         */
        BabylonInspectorDashboard.prototype.startDashboardSide = function (div) {
            var _this = this;
            if (div === void 0) { div = null; }
            this._insertHtmlContentAsync(div, function (filledDiv) {
                _this._containerDiv = filledDiv;
                _this.displayer = _this._containerDiv.querySelector("#babylonInspector-displayer");
                _this._ready = true;
            });
        };
        //TOOLS
        /**
         * Refresh tree.
         * @param scenesData
         * @private
         */
        BabylonInspectorDashboard.prototype._refreshTree = function (scenesData, clientURL) {
            this.treeRoot = this._dataTreeGenerator.generateScenesTree(scenesData, clientURL);
            this.treeRoot.unhide();
            this.treeRoot.unfold();
            this._containerDiv.appendChild(this.treeRoot.wrapper);
        };
        return BabylonInspectorDashboard;
    }(VORLON.DashboardPlugin));
    VORLON.BabylonInspectorDashboard = BabylonInspectorDashboard;
    //Register the plugin with vorlon core
    VORLON.Core.RegisterDashboardPlugin(new BabylonInspectorDashboard());
})(VORLON || (VORLON = {}));
