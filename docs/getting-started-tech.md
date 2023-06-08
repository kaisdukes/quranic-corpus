# Getting Started - Tech 

**TL;DR**: The highly valuable Quranic Arabic Corpus site needs modernization. We've chosen React for the front end because of its popularity, which attracts more volunteers. The biggest issue we're facing is a bug in the infinite scroll feature. Even if you're new to our tech stack, tackling bugs is a fantastic way to learn.

### Tech Background

The Quranic Arabic Corpus, established in 2009, currently serves millions of users with a custom in-memory graph database. However, a revamp is needed to keep up with the times.

The existing site is built on Java Server Pages (JSP) while the 2.0 prototype is built in React (https://qurancorpus.app). React was selected not because it’s the best UI technology available, but because it's sufficiently robust and widely used, increasing the chance of attracting more volunteers. 

The updated corpus interacts with the graph database via modern REST-based APIs. 

### How You Can Help

Our priority right now is resolving an intricate bug in the "infinite scroll" feature of the new user interface (https://github.com/kaisdukes/quranic-corpus/issues/21). To address this, you will need a strong grasp of React and TypeScript. 

The bug prevents the direct navigation to a specific verse, a feature currently deactivated due to the problem. Fixing this issue is crucial, as it's stalling the implementation of other features like the dictionary, ontology, and search function.

### Background Knowledge

While this might seem daunting if you're unfamiliar with our tech stack, diving into bug fixing is an effective way to familiarize yourself with a new codebase. It also paves the way for new features on our site.

The codebase is constructed following the best software engineering practices for the front end. We use a service-oriented architecture in combination with React and TSyringe for dependency injection. 

To become more familiar with the codebase:

* Download, build, and run the UI locally from the repo: https://github.com/kaisdukes/quranic-corpus
* Review the code and understand the design patterns.
* Understand how we separate Quranic script processing logic from React components using the services layer to maintain code simplicity as the codebase expands.

For background reading to help you fix the bug, consider Googling these topics:

* React Intersection Observer API
* Introduction to TypeScript for JavaScript developers
* Understanding Dependency Injection
* Getting started with TSyringe

We have a supportive community on Slack. Feel free to ask your questions on the #coding-help channel. This way, the entire team can assist you, and everyone can learn from the answers provided.
