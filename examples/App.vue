<template>
<section id="dropdown">
  <section id="dropdown-1">
    <dropdown :data="data" :cbChanged="changed1"></dropdown>
  </section>
  <section id="dropdown-2">
    <dropdown :data="data1" multiple :width="200" :cbItemChanged="changed2" :cbCustomSelectedText="customSelectedText"></dropdown>
  </section>
  <section id="dropdown-3">
    <dropdown :data="data2" multiple grouped :width="200" :cbItemChanged="changed2" :cbCustomSelectedText="customSelectedText"></dropdown>
  </section>
  <section id="dropdown-4">
    <dropdown :data="data2" grouped :width="200" :cbItemChanged="changed2" :cbCustomSelectedText="customSelectedText"></dropdown>
  </section>
</section>
</template>

<script>
import 'main'

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

const data1 = [{
  label: 'All',
  value: 1
}, {
  label: 'Volvo',
  value: 2,
  selected: true
}, {
  label: 'Mercedes',
  value: 3
}, {
  label: 'Audi',
  value: 4
}, {
  label: 'Saab',
  disabled: true,
  value: 5
}]

const data2 = [{
  label: 'Swedish Cars',
  children: [{
    label: 'Volvo',
    value: 11
  }, {
    label: 'Saab',
    value: 11
  }]
}, {
  label: 'German Cars',
  children: [{
    label: 'Mercedes',
    value: 11
  }, {
    label: 'Audi',
    value: 11
  }]
}]

export default {
  data() {
    return {
      data,
      data1,
      data2
    }
  },
  methods: {
    changed1(selected) {
      console.log(selected)
    },
    changed2(item) {
      if (item.label !== 'All') return
      let copy = JSON.parse(JSON.stringify(data1))
      copy.forEach(d => !d.disabled && (d.selected = item.selected))
      this.data1 = copy
    },
    customSelectedText(selected, defaultFn) {
      let hasAll = false
      selected.every((s) => {
        if (s.label === 'All') {
          hasAll = true
          return false
        }
        return true
      })
      if (hasAll) {
        return 'All'
      }
      return defaultFn(selected)
    }
  }
}
</script>

<style>
#dropdown {
  width: 600px;
  margin: 0 auto;
}

#dropdown>section {
  margin: 15px;
}
</style>
