<template>
  <q-page class="flex justify-center q-ma-md">
    <div style="width: 800px">
      <q-toolbar class="text-primary q-my-lg">
        <q-btn flat round dense icon="arrow_back" @click="$router.back()"/>
        <q-toolbar-title>
          属性信息
        </q-toolbar-title>
      </q-toolbar>
      <q-card class="q-ma-md">
        <q-card-section>
          <q-list>
            <q-item >
              <q-item-section>
                <q-item-label>{{name}}</q-item-label>
                <q-item-label caption>{{attDefinition[name].description}}</q-item-label>
              </q-item-section>
              <q-item-section top side>
                <div class="q-gutter-xs">
                  <q-btn @click="timerReport" color="primary" v-if="!edit && attDefinition[name].report">{{timer(name) === null ? '定时上报' : '停止定时上报'}}</q-btn>
                  <q-btn @click="report" :flat="edit?true:false" color="primary" v-if="edit || attDefinition[name].report">{{reportText}}</q-btn>
                  <q-btn color="primary" @click="clickEdit" v-if="attDefinition[name].get || attDefinition[name].report">
                    {{editText}}
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card class="q-my-md">
            <q-list>
              <q-item v-if="!edit">
                <q-item-section>
                  <q-item-label caption>属性值</q-item-label>
                  <DataValue :dataValue="getAttribute(name)" />
                </q-item-section>
              </q-item>
              <AttributeInput :attDefinition="attInput" ref="request" :edit="edit" v-if="edit"/>
            </q-list>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import AttributeInput from '../components/AttributeInput.vue'
import DataValue from '../components/DataValue.vue'
import { http } from '../components/http'
import { toDataInfo } from '../components/util'

import { date } from 'quasar'

export default {
  components: {
    AttributeInput, DataValue
  },
  name: 'attribute',
  data () {
    return {
      name: '',
      edit: false
    }
  },
  created () {
    this.name = this.$route.params.name
  },
  computed: {
    ...mapGetters({
      getAttribute: 'getAttribute',
      timer: 'getTimer'
    }),
    editText () {
      if (!this.edit) {
        return '编辑'
      } else {
        return '保存'
      }
    },
    reportText () {
      if (!this.edit) {
        return '上报'
      } else {
        return '取消'
      }
    },
    timerText () {
      if (this.timer(name) === null) {
        return '定时上报'
      } else {
        return '停止定时上报'
      }
    },
    attInput () {
      let definition = {}
      definition[this.name] = this.attDefinition[this.name]
      return definition
    },
    attDefinition () {
      let device = this.$store.getters.getCurrentUser
      return device.deviceType.attDefinition
    }
  },
  methods: {
    reportEvent () {
      let v = this.getAttribute(this.name)
      if (v) {
        let event = {}
        let convert = toDataInfo(this.getAttribute(this.name))
        event[this.name] = convert
        let timeStamp = Date.now()
        let formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
        let info = {
          'values': event,
          'reportTime': formattedString
        }
        http('post', '/events', info, (response) => {
          this.$q.notify({
            message: this.name + '上报成功',
            color: 'positive'
          })
        })
      } else {
        this.$q.notify({
          message: '上报前请设置属性：' + this.name
        })
      }
    },
    report () {
      if (this.edit) {
        this.edit = false
      } else {
        this.reportEvent()
      }
    },
    timerReport () {
      let value = {}
      if (this.timer(this.name) === null) {
        this.$q.dialog({
          title: '上报周期',
          message: '请输入定时上报周期（秒）：',
          prompt: {
            model: 10,
            isValid: val => val > 0,
            type: 'number'
          },
          ok: {
            label: '确定'
          },
          cancel: {
            label: '取消',
            flat: true
          },
          persistent: true
        }).onOk(data => {
          let timer = setInterval(() => { this.reportEvent() }, data * 1000)
          value[this.name] = timer
          this.$store.commit('setTimer', value)
        }).onCancel(() => {
        })
      } else {
        clearInterval(this.timer(this.name))
        value[this.name] = null
        this.$store.commit('setTimer', value)
      }
    },
    clickEdit () {
      if (!this.edit) {
        this.edit = true
      } else {
        if (this.$refs.request.canSubmit()) {
          this.edit = false
          let value = this.$refs.request.getInputValue(false)
          this.$store.commit('setAttribute', value)
        }
      }
    }
  }
}
</script>

<style>
</style>
