---
name: FSD architecture
description: This skill is used to structure the project correctly by following the principles of Feature Sliced Design Architecture.
---

# Skill

Use this skill when you need to create or move any file or folder. Use it to know where to place it.
Also use it if a code review is asked.

## When use it

- When creating or moving any new file or folder and for a code review

## Instructions

### General explanation

Layers, slices, and segments form a hierarchy like this:

`Layers`:

app
processes (depracted)
pages
widgets
features
entities
shared

Have `Slices`, exemple :

user
post
comment

Then `Slices` have `Segments`,

ui
model
api
lib
...

The “Layers” pillar contains seven divisions arranged top to bottom and labeled “app”, “processes”, “pages”, “widgets”, “features”, “entities”, and “shared”. The “processes” division is crossed out. The “entities” division is connected to the second pillar “Slices” in a way that conveys that the second pillar is the content of “entities”.

The “Slices” pillar contains three divisions arranged top to bottom and labeled “user”, “post”, and “comment”. The “post” division is connected to the third pillar “Segments” in the same way such that it’s the content of “post”.

The “Segments” pillar contains three divisions, arranged top to bottom and labeled “ui”, “model”, and “api”.

Layers
Layers are standardized across all FSD projects. You don’t have to use all of the layers, but their names are important. There are currently seven of them (from top to bottom):

App — everything that makes the app run — routing, entrypoints, global styles, providers.
Processes (deprecated) — complex inter-page scenarios.
Pages — full pages or large parts of a page in nested routing.
Widgets — large self-contained chunks of functionality or UI, usually delivering an entire use case.
Features — reused implementations of entire product features, i.e. actions that bring business value to the user.
Entities — business entities that the project works with, like user or product.
Shared — reusable functionality, especially when it’s detached from the specifics of the project/business, though not necessarily.

Layers App and Shared, unlike other layers, do not have slices and are divided into segments directly.

However, all other layers — Entities, Features, Widgets, and Pages, retain the structure in which you must first create slices, inside which you create the segments.

Slices
Next up are slices, which partition the code by business domain. You’re free to choose any names for them, and create as many as you wish. Slices make your codebase easier to navigate by keeping logically related modules close together.

Slices cannot use other slices on the same layer, and that helps with high cohesion and low coupling.

Segments
Slices, as well as layers App and Shared, consist of segments, and segments group your code by its purpose. Segment names are not constrained by the standard, but there are several conventional names for the most common purposes:

ui — everything related to UI display: UI components, date formatters, styles, etc.
api — backend interactions: request functions, data types, mappers, etc.
model — the data model: schemas, interfaces, stores, and business logic.
lib — library code that other modules on this slice need.
config — configuration files and feature flags.
Usually these segments are enough for most layers, you would only create your own segments in Shared or App, but this is not a rule.

## Import rule on layers

Layers are made up of slices — highly cohesive groups of modules. Dependencies between slices are regulated by the import rule on layers:

A module (file) in a slice can only import other slices when they are located on layers strictly below.

For example, the folder 📁 ~/features/aaa is a slice with the name “aaa”. A file inside of it, ~/features/aaa/api/request.ts, cannot import code from any file in 📁 ~/features/bbb, but can import code from 📁 ~/entities and 📁 ~/shared, as well as any sibling code from 📁 ~/features/aaa, for example, ~/features/aaa/lib/cache.ts.

Layers App and Shared are exceptions to this rule — they are both a layer and a slice at the same time. Slices partition code by business domain, and these two layers are exceptions because Shared does not have business domains, and App combines all business domains.

In practice, this means that layers App and Shared are made up of segments, and segments can import each other freely.

## Shared folder

This layer forms a foundation for the rest of the app. It’s a place to create connections with the external world, for example, backends, third-party libraries, the environment. It is also a place to define your own highly contained libraries.

This layer, like the App layer, does not contain slices. Slices are intended to divide the layer into business domains, but business domains do not exist in Shared. This means that all files in Shared can reference and import from each other.

Here are the segments that you can typically find in this layer:

📁 api — the API client and potentially also functions to make requests to specific backend endpoints.
📁 ui — the application’s UI kit. Components on this layer should not contain business logic, but it’s okay for them to be business-themed. For example, you can put the company logo and page layout here. Components with UI logic are also allowed (for example, autocomplete or a search bar).
📁 lib — a collection of internal libraries. This folder should not be treated as helpers or utilities (read here why these folders often turn into a dump). Instead, every library in this folder should have one area of focus, for example, dates, colors, text manipulation, etc. That area of focus should be documented in a README file. The developers in your team should know what can and cannot be added to these libraries.
📁 config — environment variables, global feature flags and other global configuration for your app.
📁 routes — route constants or patterns for matching routes.
📁 i18n — setup code for translations, global translation strings.
You are free to add more segments, but make sure that the name of these segments describes the purpose of the content, not its essence. For example, components, hooks, and types are bad segment names because they aren’t that helpful when you’re looking for code.

### Documentation

- https://fsd.how/docs/reference/layers
- https://fsd.how/docs/reference/slices-segments
- https://fsd.how/docs/reference/public-api

### Exemple

- https://fsd.how/docs/get-started/tutorial
