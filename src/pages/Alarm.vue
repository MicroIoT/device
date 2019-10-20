<template>
  <q-page class="flex justify-center q-ma-md">
    <div style="width: 800px">
      <q-toolbar class="text-primary q-my-lg">
        <q-btn flat round dense icon="arrow_back" @click="$router.back()"/>
        <q-toolbar-title>
          告警信息
        </q-toolbar-title>
      </q-toolbar>
      <q-card class="q-ma-md">
        <q-card-section>
          <q-list>
            <q-item >
              <q-item-section>
                <q-item-label>{{name}}</q-item-label>
                <q-item-label caption>{{alarmDefinition[name].description}}</q-item-label>
              </q-item-section>
              <q-item-section top side>
                <div class="q-gutter-xs">
                  <q-btn @click="report" :flat="edit?true:false" color="primary">{{reportText}}</q-btn>
                  <q-btn color="primary" @click="clickEdit" >
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
                  <q-item-label caption>告警信息</q-item-label>
                  <DataValue :dataValue="getAlarm(name)" />
                </q-item-section>
              </q-item>
              <AttributeInput :attDefinition="alarmInput" ref="request" :edit="edit" v-if="edit"/>
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
  name: 'alarm',
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
      getAlarm: 'getAlarm'
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
    alarmInput () {
      let definition = {}
      definition[this.name] = this.alarmDefinition[this.name]
      return definition
    },
    alarmDefinition () {
      let device = this.$store.getters.getCurrentUser
      return device.deviceType.alarmTypes
    }
  },
  methods: {
    report () {
      if (this.edit) {
        this.edit = false
      } else {
        let v = this.getAlarm(this.name)
        if (v) {
          let alarm = toDataInfo(this.getAlarm(this.name))
          let timeStamp = Date.now()
          let formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD HH:mm:ss')
          let info = {
            'alarmInfo': alarm,
            'alarmType': this.name,
            'reportTime': formattedString
          }
          console.log(info)
          http('post', '/alarms', info, (response) => {
            this.$q.dialog({
              title: '上报成功',
              ok: {
                label: '确定'
              }
            })
          })
        } else {
          this.$q.notify({
            message: '上报前请设置告警信息：' + this.name
          })
        }
      }
    },
    clickEdit () {
      if (!this.edit) {
        this.edit = true
      } else {
        if (this.$refs.request.canSubmit()) {
          this.edit = false
          let value = this.$refs.request.getInputValue(false)
          this.$store.commit('setAlarm', value)
        }
      }
    }
  }
}
</script>

<style>
</style>
