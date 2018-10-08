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
