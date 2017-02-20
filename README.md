# vue-dropdown

This is yet another vue dropdown component.

## Install

Use npm to download code:

```
npm install hsy-vue-dropdown -S
```

then import it into your project, add below code into your `main.js`:

```js
import Dropdown from 'hsy-vue-dropdown'

Vue.use(Dropdown)
```

## Usage

```html
<template>
  <dropdown :data="data" :cbChanged="changed"></dropdown>
</template>

<script>
const data = [{
  label: 'Volvo',
  value: 1
}, {
  label: 'Saab',
  value: 2
}, {
  label: 'Long long long long long long test',
  value: 2
}]

export default {
  data() {
    return {
      data
    }
  },
  methods: {
    changed(selected) {
      console.log(selected)
    }
  }
}
</script>
```

## Props

Coming...


## Demo

[Demo](http://vue-demo.hsiaosiyuan.com/#/dropdown)

## Screenshot

<img src="http://og9g58alt.bkt.clouddn.com/dropdown.png" width="300">
