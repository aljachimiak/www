---
title: "Introduction to Oddworks Stores"
---
Stores are the generic implementation within Oddworks to persist data to a database. Oddworks is optimized for read speed so stores are based on key/value patterns.

Your store can be backed by any database implementation. For example: Redis, MySQL, or MongoDB. Since more Oddworks servers are setup to optmize for read throughput, Redis is a common choice. There is also a Redis implemenation included in the Oddworks library for you.

You can figure more than 1 store and configure each to store different types of objects. Specifying different stores for different types means Oddworks is flexible enough to store identity resources in Redis and all catalog resources in MongoDB for example, if you feel that suits your needs best.

### Defining a Store
A store must be a single module which exports the required properties:

* `initialize` - Initialization Function
* `name` - Name String

The `inititialization()` method should be defined by the store to initialize itself, potentially asynchronously. See [Store Initialization](#initialization) for more.

The `name` property is simply used for better messaging in error handlers and loggers.

As an example of an Oddworks store definition, check out the [built in Redis Store](https://github.com/oddnetworks/oddworks/blob/master/lib/stores/redis/index.js).

### Data Objects
Any object in an Oddworks Store must have 2 specific properties at minimum:

* `id` - the id of the resource
* `type` - the type of the resource

Other properties can be added to suit the needs of your particular use cases. In fact many features available to you through Oddworks are made possible by setting particular properties on stored objects. However, `id` and `type` are the only properties required on every object.
