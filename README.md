<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://github.com/shorterloop/deep-searching-shorterloop-backlog/blob/main/deep-searching.svg?raw=true" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Deep Searching Filter</h3>

  <p align="center">
    Searching by `{ ... filters... }` deep in a nested array or nested object.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#example">Example</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is simple javascript code for deep searching i.e., when input (array or object) is nested then it search for all the elements that matches the keyword and returns filtered data.

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

This is basic js code can be implemented in frontend or backend.

### Installation

Install NPM packages

```sh
 npm i deep-level-backlog-filters
```

<!-- USAGE EXAMPLES -->

## Usage

1- import 'deep-level-backlog-filters'

```sh
import deepSearching from 'deep-level-backlog-filters';
```

2- Input

| Attribute      | Description                                           |
|----------------|-------------------------------------------------------|
| data   | array in which we have to perform searching          |
| filterData        | search string example { workItem: 'US-', searchingKeyword: '' }            |
| Replacements   |                                                      |
|                | `{`                                                  |
|                | `  workItem: 'externalKey',`                         |
|                | `  owner: 'userId',`                                 |
|                | `  status: 'progress',`                              |
|                | `}`                                                  |


```sh
let filteredData = deepSearching({workItem: 'US-'}, nestedArray, replacements);
```

<!-- EXAMPLES -->

## Example

```sh
import deepSearching from 'deep-level-backlog-filters';

filteredData = deepSearching( {workItem: 'US-', searchingKeyword: ''}, data, {
  workItem: 'externalKey',
  owner: 'userId',
  status: 'progress'
});
```
