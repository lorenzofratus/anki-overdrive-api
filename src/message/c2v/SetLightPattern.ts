import { AbstractVehicleMessage } from "../AbstractVehicleMessage";
import { ANKI_VEHICLE_MSG_C2V_LIGHTS_PATTERN } from "../Protocol";

const ANKI_VEHICLE_MSG_C2V_LIGHTS_PATTERN_SIZE = 17;
const ANKI_VEHICLE_MAX_LIGHT_INTENSITY = 14;

const LIGHT_CHANNEL_COUNT_MAX = 3;
const LIGHT_CHANNEL_CONFIG_SIZE = 5;

enum LightChannel {
	LIGHT_RED = 0,
	LIGHT_TAIL = 1,
	LIGHT_BLUE = 2,
	LIGHT_GREEN = 3,
	LIGHT_FRONTL = 4,
	LIGHT_FRONTR = 5,
	LIGHT_COUNT = 6
}

enum LightEffect {
	EFFECT_STEADY = 0, // Simply set the light intensity to 'start' value
	EFFECT_FADE = 1, // Fade intensity from 'start' to 'end'
	EFFECT_THROB = 2, // Fade intensity from 'start' to 'end' and back to 'start'
	EFFECT_FLASH = 3, // Turn on LED between time 'start' and time 'end' inclusive
	EFFECT_RANDOM = 4, // Flash the LED erratically - ignoring start/end
	EFFECT_COUNT = 5
}

class LightChannelConfig {

	public readonly channel: LightChannel;
	public readonly effect: LightEffect;
	public readonly start: number;
	public readonly end: number;
	public readonly cycles_per_10_sec: number;

	public constructor(channel: LightChannel, effect: LightEffect, start: number, end: number, cycles_per_minute: number) {
		this.channel = channel;
		this.effect = effect;
		this.start = Math.min(start, ANKI_VEHICLE_MAX_LIGHT_INTENSITY);
		this.end = Math.min(end, ANKI_VEHICLE_MAX_LIGHT_INTENSITY);
		this.cycles_per_10_sec = cycles_per_minute / 6;
	}

	public writeToBuffer(buffer: Buffer, offset: number) {
		buffer.writeUInt8(this.channel, offset);
		buffer.writeUInt8(this.effect, offset + 1);
		buffer.writeUInt8(this.start, offset + 2);
		buffer.writeUInt8(this.end, offset + 3);
		buffer.writeUInt8(this.cycles_per_10_sec, offset + 4);
	}
	
}

class SetLightPattern extends AbstractVehicleMessage {

	public readonly channels: LightChannelConfig[];

	public constructor(vehicleId: string, channels: LightChannelConfig[]) {
		super(vehicleId, Buffer.alloc(ANKI_VEHICLE_MSG_C2V_LIGHTS_PATTERN_SIZE + 1));

		channels = channels.slice(0, LIGHT_CHANNEL_COUNT_MAX);
		this.payload.writeUInt8(ANKI_VEHICLE_MSG_C2V_LIGHTS_PATTERN_SIZE, 0);
		this.payload.writeUInt8(ANKI_VEHICLE_MSG_C2V_LIGHTS_PATTERN, 1);
		this.payload.writeUInt8(channels.length, 2);
		let offset = 3;
		for (const channel of channels) {
			channel.writeToBuffer(this.payload, offset);
			offset += LIGHT_CHANNEL_CONFIG_SIZE;
		}
		this.channels = channels;
	}

}

export { LightChannel, LightEffect, LightChannelConfig, SetLightPattern };

