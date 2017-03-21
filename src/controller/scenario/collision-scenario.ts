import {Vehicle} from "../../core/vehicle/vehicle-interface";
import {Scenario} from "./scenario-interface";
import {VehicleDelocalizedMessage} from "../../core/message/v2c/vehicle-delocalized-message";
import {LightConfig} from "../../core/vehicle/light-config";
import {VehicleMessage} from "../../core/message/vehicle-message";
import {PositionUpdateMessage} from "../../core/message/v2c/position-update-message";

class CollisionScenario implements Scenario {

    private _vehicle1: Vehicle;
    private _vehicle2: Vehicle;
    private _store: { [key: string]: Vehicle } = {};
    private _collided = false;
    private _running = false;

    constructor(vehicle1: Vehicle, vehicle2: Vehicle) {
        this._vehicle1 = vehicle1;
        this._vehicle2 = vehicle2;
        this._store[vehicle1.id] = vehicle1;
        this._store[vehicle2.id] = vehicle2;
    }


    start(): Promise<void> {
        let me = this,
            v1 = me._vehicle1,
            v2 = me._vehicle2;

        me._running = true;
        return new Promise<void>((resolve, reject) => {
            try {
                console.log("CS (0): Starting");
                v1.setSpeed(350, 100);
                v2.setSpeed(900, 100);

                setTimeout(() => {
                    console.log("CS (0:09): Changing on different lanes");
                    v1.changeLane(-68);
                    v2.changeLane(50.5);
                }, 9000);

                setTimeout(() => {
                    console.log("ACS (0:30): Slow vehicle changes to outer lane.");
                    v1.changeLane(68);
                }, 30000);

                let interval = setInterval(() => {
                    if (me._collided) {
                        console.log("CS (?): Scenario Finished.");
                        clearInterval(interval);
                        me._running = false;
                        resolve();
                    }

                }, 200);
            } catch (e) {
                me._running = false;
                reject(e);
            }
        });
    }

    interrupt(): Promise<void> {
        let me = this;

        return new Promise<void>((resolve, reject) => {
            try {
                this._vehicle1.setSpeed(0, 1500);
                this._vehicle2.setSpeed(0, 1500);
                setTimeout(() => {
                    me._running = false;
                    resolve();
                }, 1000);
            } catch (e) {
                reject(e);
            }
        });

    }

    showCollision() {
        let me = this;
        console.log("CS (?): Collision.");

        for (let key in me._store) {
            if (me._store.hasOwnProperty(key)) {
                let vehicle = me._store[key];
                vehicle.setSpeed(0, 1500);
                vehicle.setLights([
                    new LightConfig()
                        .blue()
                        .steady(0),
                    new LightConfig()
                        .red()
                        .flash(0, 10, 10),
                    new LightConfig()
                        .tail()
                        .flash(0, 10, 10)
                ]);
            }
        }

        setTimeout(() => {
            me._collided = true;
        }, 10000);
    }

    onUpdate(message: VehicleMessage): void {
        let me = this;

        if (message instanceof PositionUpdateMessage && me._running) {

            message.distances.forEach(distance => {
                if (distance.vertical < 34 && distance.horizontal < 200)
                    me.showCollision();
            });

        } else if (message instanceof VehicleDelocalizedMessage) {
            me.showCollision();
        }
    }

    isRunning(): boolean {
        return this._running;
    }
}

export {CollisionScenario};