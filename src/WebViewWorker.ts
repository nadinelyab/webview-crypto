import {parse, stringify} from "../src/serializeBinary";
import {subtle} from "../src/compat";

declare var require: any;
const serializeError: any = require("serialize-error");

class WebViewWorker {
  constructor(private sendToMain: (message: string, domain: string) => void) {
    sendToMain("We are ready!", '*');
  }

  async onMainMessage (message) {
    let id, method, args;
    try {
      const time0 = performance.now();
      ({id, method, args} = await parse(message));
      const time1 = performance.now();
        console.log('time to parse message', time0 - time1)
    } catch (e) {
      await this.send({
        reason: `Couldn't parse data: ${e}`
      });
      return;
    }
    let value;
    try {
      if (method === "getRandomValues") {
        value = crypto.getRandomValues(args[0]);

      } else {
        const t0 = performance.now()
        const methodName = method.split(".")[1];
        value = await subtle()[methodName].apply(subtle(), args);
        // if we import a crypto key, we want to save how we imported it
        // so we can send that back and re-create the key later
        if (methodName === "importKey") {
          value._import = {
            format: args[0],
            keyData: args[1]
          }
        }
        const t1 = performance.now()
          console.log('time to apply method', methodName, t1 - t0)
      }
    } catch (e) {
      await this.send({id, reason: (serializeError as any)(e)});
      return;
    }
    await this.send({id, value});
  }

  async send(data: any) {
    let message: string;
    try {
      message = await stringify(data);
    } catch (e) {
      const newData = {
        id: data.id,
        reason: `stringify error ${e}`
      };
      this.sendToMain(JSON.stringify(newData), '*');
      return;
    }
    this.sendToMain(message, '*');
  }
}

export = WebViewWorker;
