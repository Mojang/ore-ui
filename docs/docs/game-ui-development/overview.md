---
sidebar_position: 1
---

# Game UI Development Overview

`@react-facet` is meant to support the particular use case of UIs meant to run inside a computer game. In recent years, game developers have felt the need for a greater standarization, simplification and improvement in accessibility of in-game UIs, including the main menu, setting screens, and HUDs shown during live gameplay.

Because of the explosive growth of web application development—and the low barrier to entry into frontend development—a lot of knowledge and tooling has been accumulated over the last two decades on how to do great UIs within the web community; this in turn led to the adoption of web-inspired technologies into non-web platforms, such as the integration of JavaScript engines as part of iOS development libraries, and many efforts to make mobile application development look like web development to drive developers into the mobile platforms.

In this context, games have started integrating web engines into their platform, to be able to make use of the talent pool and tooling already available for UI development. In particular, Coherent Lab's Gameface provides a web browser environment that can be directly integrated into a C++ codebase, with plugins to Unreal Engine and Unity. The [Chromium Embedded Framework](https://en.wikipedia.org/wiki/Chromium_Embedded_Framework) provides a very similar option for game developers in many popular environments.

## Performance concerns

This new environment for web development presents however a unique challenge; the question that has historically given pause to game developers is, "will web technologies be performant enough to operate under the stringent frame budgets of real time games?"

The answer is now a qualified **yes**.

The answer used to be a flat **no**, but continuous improvements on the consumer hardware and in the quality of JavaScript engines (such as v8 and JavaScriptCore) mean that nowadays it is possible to run game UIs with enough performance to fit the 60 fps budget in even some of the slowest devices on the market, provided measures are taken for those web technologies to be used optimally. But what measures?

Optimal performance is always obtained by doing as little as possible; so direct DOM manipulation without any library or framework will naturally be the approach to web development that will lead to the most performant applications. This, however, defeats the purpose of using web technologies, which is to take advantage of the tools available uniquely to the web. Say, for example, that React is one of those coveted tools; can we still use React within a game UI without running over our performance budget?

Enter `@react-facet`, which is the solution we built to address this issue after years of working within these exact constraints in the Minecraft Bedrock edition.

To find a way to be able to get all the design, developer experience, organizational and code sustainability benefits of React, we worked on identifying the particular performance concerns that would raise out of using it. Our exploration yields a clear result:

1. Any manipulation of the DOM is to be avoided. Setting a property on the DOM, even if it is set to the same value that it had before, is orders of magnitude more expensive that pure object manipulation within JavaScript.
2. Reconciliation is the most expensive feature of React, by a long margin. Mounting and unmounting components is to be avoided, and re renders caused by prop changes are to be avoided as well.

<!--
## How does React Facet address this?

TODO
-->
