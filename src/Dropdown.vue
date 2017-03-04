<template>
<div class="hsy-dropdown" :class="cls" :style="{width: width + 'px'}">
  <div class="selected" @click="autoShow" :style="{backgroundPosition: (width - 18) + 'px, center'}">{{ selectedText }}</div>
  <transition name="fadeIn" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="list" v-show="isShow" :style="{width: fixListWidth ? width + 'px' : 'auto'}">
      <div class="inner">
        <div class="item" v-if="!grouped" v-for="item in items" :data-title="item.label" @click="!multiple && itemClicked(item)" :class="{selected: item.selected}">
          {{ appendIdx(item) }}
          <div v-if="multiple">
            <input type="checkbox" :disabled="item.disabled" :checked="item.selected" @change="checkboxChanged(item)" :id="id(item)">
            <label :for="id(item)" @click="itemClicked(item)">{{ item.label }}</label>
          </div>
          <div v-else>
            {{ item.label }}
          </div>
        </div>
        <div v-if="grouped">
          <div v-for="group in items" class="group">
            <h3>{{ group.label }}</h3>
            <div class="item" v-for="item in group.children" :data-title="item.label" @click="!multiple && itemClicked(item)" :class="{selected: item.selected}">
              {{ appendIdx(item) }}
              <div v-if="multiple">
                <input type="checkbox" :disabled="item.disabled" :checked="item.selected" @change="checkboxChanged(item)" :id="id(item)">
                <label :for="id(item)" @click="itemClicked(item)">{{ item.label }}</label>
              </div>
              <div v-else>
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</div>
</template>

<script>
const EMPTY_FN = () => {}

let idx = 0

export default {
  name: 'Dropdown',

  data() {
    return {
      selected: [],
      isShow: false,
      items: []
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    grouped: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Please choose'
    },
    width: {
      type: Number,
      default: 120
    },
    fixListWidth: {
      type: Boolean,
      default: true
    },
    cbChanged: {
      type: Function,
      default: EMPTY_FN
    },
    cbItemChanged: {
      type: Function,
      default: EMPTY_FN
    },
    cbCustomSelectedText: {
      type: Function,
      default: EMPTY_FN
    }
  },
  computed: {
    cls() {
      let c = {
        grouped: this.grouped,
        multiple: this.multiple
      }
      return c
    },
    selectedText() {
      let text = ''
      let fn = selected => selected.map((e) => e.label).join(', ')
      if (this.cbCustomSelectedText !== EMPTY_FN) {
        text = this.cbCustomSelectedText(this.selected, fn)
      } else {
        text = fn(this.selected)
      }
      return text === '' ? this.placeholder : text
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.selected = this.data.filter(d => d.selected)
        this.items = this.data.slice(0)
      }
    }
  },
  methods: {
    id(item) {
      return 'hsy-dropdown-item-' + item._idx
    },
    appendIdx(item) {
      if (item._idx === undefined) {
        item._idx = ++idx
      }
    },
    autoShow() {
      this.isShow = !this.isShow
    },
    setupTitleIfNeeded() {
      if (!this.fixListWidth) return
    },
    autoHide(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isShow = false
      }
    },
    findSelected() {
      if (!this.grouped) {
        return this.data.filter(d => d.selected === true)
      }
      let items = []
      return this.data.reduce((pre, e) => {
        pre = pre.concat(e.children)
        return pre
      }, items).filter(d => d.selected === true)
    },
    itemClicked(item) {
      if (!this.multiple) {
        if (this.selected.indexOf(item) === -1) {
          this.findSelected().forEach((d) => d.selected = false)
          item.selected = true
          this.selected.pop()
          this.selected.push(item)

          if (this.cbChanged !== EMPTY_FN) {
            this.cbChanged(this.findSelected())
          }
        }
        this.$nextTick(() => {
          this.isShow = false
        })
      }
    },
    checkboxChanged(item) {
      if (this.selected === null) {
        this.selected = []
      }

      let id = this.id(item)
      item.selected = document.querySelector('#' + id).checked

      if (!item.selected) {
        this.selected = this.selected.filter((d) => d !== item)
      } else {
        this.selected.push(item)
      }

      if (this.cbItemChanged !== EMPTY_FN) {
        this.cbItemChanged(item)
      }
      if (this.cbChanged !== EMPTY_FN) {
        this.cbChanged(this.selected)
      }
    }
  },
  updated() {
    this.setupTitleIfNeeded()
  },
  mounted() {
    this.setupTitleIfNeeded()
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed() {
    document.removeEventListener('click', this.autoHide, false)
  }
}
</script>

<style>
.hsy-dropdown {
  font: 10px "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
  display: inline-block;
  position: relative;
}

.hsy-dropdown>.selected {
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
  border: 1px solid #B3C1D8;
  font-size: 1.2em;
  padding: 0 20px 0 10px;
  color: #4C5565;
  cursor: pointer;
  background: url('assets/arrow.svg') no-repeat right center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hsy-dropdown>.list {
  position: absolute;
  top: 35px;
  left: 0px;
  font-size: 1.2em;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 3px;
  z-index: 100;
}

.hsy-dropdown>.list>.inner {
  padding: 5px;
}

.hsy-dropdown>.list .item {
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-position: 5px center;
}

.hsy-dropdown>.list .item:hover,
.hsy-dropdown.multiple>.list .item:hover {
  background-color: #eee;
  border-radius: 3px;
}

.hsy-dropdown>.list .item {
  /*transition: all .35s ease-in-out;*/
}

.hsy-dropdown>.list .item.selected {
  background: #7D8699 url('assets/right.svg') no-repeat 10px center;
  border-radius: 3px;
  color: #fff;
  padding-left: 35px;
}

.hsy-dropdown .animated {
  animation-duration: 0.35s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hsy-dropdown .fadeIn {
  animation-name: fadeIn;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.hsy-dropdown .fadeOut {
  animation-name: fadeOut;
}

.hsy-dropdown.multiple .item {
  color: #7D8699;
  padding: 0 5px;
}

.hsy-dropdown.multiple .item.selected {
  background: none;
  padding: 0 5px;
  color: #7D8699;
}

.hsy-dropdown.multiple .item input {
  display: none;
}

.hsy-dropdown.multiple .item input+label {
  display: block;
  padding-left: 23px;
  background: url('assets/chk.svg') no-repeat 0px center;
  vertical-align: middle;
  margin: 0;
  cursor: pointer;
}

.hsy-dropdown.multiple .item input:checked+label {
  background: url('assets/chked.svg') no-repeat 0px center;
}

.hsy-dropdown.multiple .item input:disabled+label {
  color: #ccc;
  cursor: not-allowed;
}

.hsy-dropdown .group {
  font-size: 10px;
}

.hsy-dropdown .group h3 {
  font-size: 1.2em;
  font-weight: 500;
  padding-left: 5px;
  cursor: default;
}

.hsy-dropdown .group .item {
  font-size: 1.2em;
}
</style>
