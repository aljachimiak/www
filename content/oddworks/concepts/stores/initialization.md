---
title: "Initializing Your Oddworks Stores"
---

Each store's implementation will require different initialization options. For example: The built in Redis and Redis Search stores both require a Redis instance and will need Redis connection options passed into them.

The initialization function defined in a store module must return a Promise since it is assumed that the store may need to setup some database connections asynchronously. The Oddworks message bus as well as the configuration options are passed in as the first and second arguments to `initialize()`. When you implement a new store you should use this method to initialize your store: Setup database connections, configure the underlying storage mechanisms, run migrations, etc.

### Message Bus in Oddworks Stores
It is expected that, before you return a resolved Promise from your `initialize()` method, you add query and command handlers on the message bus for the object types your store will support. Stores should support these two basic message patterns:

> config.bus.queryHandler({role: 'store', cmd: 'get', type: type}, get);
> config.bus.commandHandler({role: 'store', cmd: 'set', type: type}, set);

See the [Message Bus](/oddworks/concepts/message_bus/) section for more information.

## Example Oddworks Store Initialization
As an example of an Oddworks store initialization, check out the [built in Redis Store](https://github.com/oddnetworks/oddworks/blob/master/lib/stores/redis/index.js).

