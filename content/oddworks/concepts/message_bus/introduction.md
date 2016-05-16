---
title: "Introduction to the Oddworks Message Bus"
---
Instead of model-view-controller (MVC), Oddworks follows the concept of command/query responsibility segregation (CQRS). In CQRS commands are operations which write our data while queries are operations which read our data. Most importantly, the logic for commands and queries never mix.

When a command is sent into the system it arrives in a component which understands how the data should be structured and how to persist it. Once your command component has written the data, it may broadcast successful create, update, and delete events to the rest of the system without caring about who might be listening.

Other components may then listen for data changes broadcasted by the command components and take appropriate action depending on their internal logic.

To make all this work, you need an asynchronous communication mechanism to send messages between components in your system. This communication is where Oddcast comes in.