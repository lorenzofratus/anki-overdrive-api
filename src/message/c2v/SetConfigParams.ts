import { AbstractVehicleMessage } from "../AbstractVehicleMessage";
import { ANKI_VEHICLE_MSG_C2V_SET_CONFIG_PARAMS } from "../Protocol";

const ANKI_VEHICLE_MSG_C2V_SET_CONFIG_PARAMS_SIZE  = 3;

enum TrackMaterial {
    PLASTIC = 0,
    VINYL = 1,
}

class SetConfigParams extends AbstractVehicleMessage {
    
	public readonly superCodeParseMask: number
    public readonly trackMaterial: TrackMaterial

	public constructor(vehicleId: string, superCodeParseMask: number, trackMaterial: TrackMaterial) {
		super(vehicleId, Buffer.alloc(ANKI_VEHICLE_MSG_C2V_SET_CONFIG_PARAMS_SIZE  + 1));

		this.payload.writeUInt8(ANKI_VEHICLE_MSG_C2V_SET_CONFIG_PARAMS_SIZE , 0);
		this.payload.writeUInt8(ANKI_VEHICLE_MSG_C2V_SET_CONFIG_PARAMS, 1);
        this.payload.writeUInt8(superCodeParseMask, 2);
        this.payload.writeUInt8(trackMaterial, 3);
		this.superCodeParseMask = superCodeParseMask;
        this.trackMaterial = trackMaterial;
	}

}

export { TrackMaterial, SetConfigParams };

