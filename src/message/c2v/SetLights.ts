import { AbstractVehicleMessage } from "../AbstractVehicleMessage";
import { ANKI_VEHICLE_MSG_C2V_SET_LIGHTS } from "../Protocol";

const ANKI_VEHICLE_MSG_C2V_SET_LIGHTS_SIZE = 2;

class SetLights extends AbstractVehicleMessage {
    
	public readonly lightValue: number

	public constructor(vehicleId: string, lightsMask: number) {
		super(vehicleId, Buffer.alloc(ANKI_VEHICLE_MSG_C2V_SET_LIGHTS_SIZE + 1));

		this.payload.writeUInt8(ANKI_VEHICLE_MSG_C2V_SET_LIGHTS_SIZE, 0);
		this.payload.writeUInt8(ANKI_VEHICLE_MSG_C2V_SET_LIGHTS, 1);
        this.payload.writeUInt8(lightsMask, 2);
		this.lightValue = lightsMask;
	}

}

export { SetLights };

