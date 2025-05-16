/* eslint-disable perfectionist/sort-objects */
import { DeviceData } from "@interfaces/deviceData.js";
import BaseModel from "@modules/baseModel.js";

/**
 * The device model class
 *
 * @class DeviceModel
 * @extends BaseModel
 */
class DeviceModel extends BaseModel<DeviceData> {
  /**
   * The constructor for the DeviceModel class
   */
  public constructor() {
    super("devices.json");
  }

  /**
   * Create the device data
   *
   * @param {string} device_key - The name
   *
   * @returns {ContactData} The redeem data
   */
  public async create(device_key: string): Promise<DeviceData> {
    const deviceData: DeviceData = {
      key: device_key,
      email: null,
      registeredAt: new Date().toISOString(),
      updatedAt: null,
    };

    await this.save(device_key, deviceData);

    return deviceData;
  }

  /**
   * Update the device data
   *
   * @param {string} device_key - The name
   * @param {DeviceData} deviceData - The device data
   *
   * @returns {DeviceData} The redeem data
   */
  public async update(device_key: string, deviceData: DeviceData): Promise<DeviceData | null> {
    const existingData = await this.find(device_key);
    if (!existingData) return null;

    existingData.email = deviceData.email;
    existingData.updatedAt = new Date().toISOString();

    await this.save(device_key, existingData);

    return existingData;
  }
}

export default DeviceModel;
