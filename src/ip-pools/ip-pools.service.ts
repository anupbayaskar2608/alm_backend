import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IpPool, IpPoolDocument } from './schemas/ip-pool.schema';

@Injectable()
export class IpPoolsService {
  constructor(
    @InjectModel(IpPool.name) private ipPoolModel: Model<IpPoolDocument>,
  ) {}

  async findAll(): Promise<IpPoolDocument[]> {
    return this.ipPoolModel.find({ isDeleted: false }).exec();
  }

  async findById(id: string): Promise<IpPoolDocument> {
    return this.ipPoolModel.findById(id).exec();
  }

  async delete(id: string): Promise<void> {
    await this.ipPoolModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }

  async create(ipPoolData: any): Promise<IpPoolDocument> {
    // Generate IP range before saving
    ipPoolData.IP_range = this.generateIpRange(ipPoolData.IP_poolAddr, ipPoolData.CIDR);

    const newIpPool = new this.ipPoolModel(ipPoolData);
    return newIpPool.save();
  }

  async update(id: string, ipPoolData: any): Promise<IpPoolDocument> {
    // Regenerate IP range if IP or CIDR changed
    if (ipPoolData.IP_poolAddr && ipPoolData.CIDR) {
      ipPoolData.IP_range = this.generateIpRange(ipPoolData.IP_poolAddr, ipPoolData.CIDR);
    }

    return this.ipPoolModel.findByIdAndUpdate(id, ipPoolData, { new: true }).exec();
  }

  // ---------------- IP RANGE LOGIC ----------------
  private ipToInt(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  }

  private intToIp(int: number): string {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join('.');
  }

  private generateIpRange(ip: string, cidr: string) {
    const ipInt = this.ipToInt(ip);
    const maskBits = parseInt(cidr, 10);
    const mask = ~((1 << (32 - maskBits)) - 1) >>> 0;

    const networkInt = ipInt & mask;
    const broadcastInt = networkInt | ~mask;

    const ipList = [];

    for (let i = networkInt; i <= broadcastInt; i++) {
      if (i === networkInt) {
        ipList.push({ key: 'networkIP', value: this.intToIp(i) });
      } else if (i === networkInt + 1) {
        ipList.push({ key: 'default_gateway', value: this.intToIp(i) });
      } else if (i === broadcastInt) {
        ipList.push({ key: 'broadcast_ip', value: this.intToIp(i) });
      } else {
        ipList.push({ key: 'unassigned', value: this.intToIp(i) });
      }
    }

    return ipList;
  }
}
