import { IEnvironmentInfo } from '../models/IEnvironmentInfo';
import { IEnvironmentInfoCollector } from './IEnvironmentInfoCollector';
import { EventPluginContext } from '../plugins/EventPluginContext';

import os = require('os');

export class NodeEnvironmentInfoCollector implements IEnvironmentInfoCollector {
  public getEnvironmentInfo(context:EventPluginContext): IEnvironmentInfo {
    function getIpAddresses():string {
      var ips:string[] = [];
      var interfaces = os.networkInterfaces();
      Object.keys(interfaces).forEach((name) => {
        interfaces[name].forEach((iface:any) => {
          if ('IPv4' === iface.family && !iface.internal) {
            ips.push(iface.address);
          }
        });
      });

      return ips.join(', ');
    }

    if (!os) {
      return null;
    }
    
    var environmentInfo: IEnvironmentInfo = {
      processor_count: os.cpus().length,
      total_physical_memory: os.totalmem(),
      available_physical_memory: os.freemem(),
      command_line: process.argv.join(' '),
      process_name: (process.title || '').replace(/[\uE000-\uF8FF]/g, ''),
      process_id: process.pid + '',
      process_memory_size: process.memoryUsage().heapTotal,
      //thread_id: '',
      architecture: os.arch(),
      o_s_name: os.type(),
      o_s_version: os.release(),
      ip_address: getIpAddresses(),
      machine_name: os.hostname(),
      //install_id: '',
      runtime_version: process.version,
      data: {
        loadavg: os.loadavg(),
        platform: os.platform(),
        tmpdir: os.tmpdir(),
        uptime: os.uptime()
      }
    };

    if ((<any>os).endianness) {
      environmentInfo.data.endianness = (<any>os).endianness();
    }

    return environmentInfo;
  }
}
