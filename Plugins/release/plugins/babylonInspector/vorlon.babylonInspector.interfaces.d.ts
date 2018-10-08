declare module VORLON {
    enum QueryTypes {
        SPOT_MESH = 0,
        UNSPOT_MESH = 1,
        START_ANIM = 2,
        PAUSE_ANIM = 3,
        UNPAUSE_ANIM = 4,
        STOP_ANIM = 5,
        TURN_ON_LIGHT = 6,
        TURN_OFF_LIGHT = 7,
        HIDE_MESH = 8,
        DISPLAY_MESH = 9,
        DISPLAY_MESH_GIZMO = 10,
        HIDE_MESH_GIZMO = 11,
    }
    enum AnimTargetTypes {
        MESH = 0,
        MATERIAL = 1,
        CAMERA = 2,
        LIGHT = 3,
        SKELETTON = 4,
    }
    interface Message {
        type: string;
        data: any;
    }
}
