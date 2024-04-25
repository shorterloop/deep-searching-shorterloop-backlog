<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://github.com/shorterloop/deep-searching-shorterloop-backlog/blob/main/deep-searching.svg?raw=true" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Deep-Searching</h3>

  <p align="center">
    Searching by 'keyword' deep in a nested array or nested object.
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
 npm i deep-level-searching
```

<!-- USAGE EXAMPLES -->

## Usage

1- import 'deep-level-searching'

```sh
import {deepSearching} from 'deep-level-searching';
```

2- Input

- keyword -> search string
- nested array -> array in which we have to perform searching
- excludedKeys -> array of keys on which user does not want to perform searching

```sh
let filteredData = deepSearching(keyword,nestedArray,{excluded:excludedKeys});
```

<!-- EXAMPLES -->

## Example

```sh
import {deepSearching} from 'deep-level-searching';

filteredData = deepSearching(data, filteredData, {
  workItem: 'externalKey',
  owner: 'userId',
  status: 'progress',
});
```
