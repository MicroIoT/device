<template>
  <q-page class="flex justify-center q-ma-md">
    <q-pull-to-refresh @refresh="refresh">
      <div style="width: 800px">
        <q-toolbar class="text-primary q-my-lg">
          <q-btn flat round dense icon="arrow_back" @click="$router.back()"/>
            <q-toolbar-title>
              设备详细信息
            </q-toolbar-title>
        </q-toolbar>
        <q-card class="q-ma-md">
          <q-card-section>
            <q-list>
              <q-item >
                <q-item-section avatar>
                  <q-icon color="primary" :name="device.connected?'devices':'phonelink_off'" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{device.string}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-card >
              <q-field stack-label class="q-ma-md" label="设备类型">
                <template v-slot:prepend>
                  <q-icon name="event" color="primary"/>
                </template>
                <template v-slot:control >
                  <div class="self-center full-width no-outline" tabindex="0">{{device.deviceType.name}}</div>
                </template>
            </q-field>
            <q-field stack-label class="q-ma-md" label="设备场地">
              <template v-slot:prepend>
                <q-icon name="event" color="primary"/>
              </template>
              <template v-slot:control  >
                <div class="self-center full-width no-outline" tabindex="0">{{device.location && device.location.type === "site"?device.location.string:"/"}}</div>
              </template>
            </q-field>

              <AttributeValue title="设备静态属性" :attributeValue="device.attributes" v-if="device.attributes && Object.keys(device.attributes).length > 0"/>

              <q-expansion-item
                class="q-ma-md"
                switch-toggle-side
                expand-separator
                header-class="text-primary"
                label="设备动态属性"
                v-if="device.deviceType.attDefinition && Object.keys(device.deviceType.attDefinition).length > 0">
                <q-list separator>
                  <q-item v-for="(value, key) in device.deviceType.attDefinition" :key="key">
                    <q-item-section>
                      <q-item-label color="black">{{key}}</q-item-label>
                      <q-item-label caption>{{value.description}}</q-item-label>
                    </q-item-section>
                    <q-item-section side >
                      <div class="q-gutter-md q-mb-md">
                        <q-btn color="primary" v-if="value.get" @click="gotoGet(key)" >读取</q-btn>
                        <q-btn color="primary" v-if="value.set" @click="gotoSet(key)" >设置</q-btn>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>

              <q-expansion-item
                class="q-ma-md"
                switch-toggle-side
                expand-separator
                header-class="text-primary"
                label="设备操作"
                v-if="device.deviceType.actionTypes && Object.keys(device.deviceType.actionTypes).length > 0">
                <q-list separator>
                  <q-item v-for="(value, key) in device.deviceType.actionTypes" :key="key">
                    <q-item-section>
                      <q-item-label color="black">{{key}}</q-item-label>
                      <q-item-label caption>{{value.description}}</q-item-label>
                    </q-item-section>
                    <q-item-section side >
                      <q-btn color="primary" @click="gotoAction(key)">执行</q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-card>
          </q-card-section>
        </q-card>
      </div>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import { http } from '../components/http'
import AttributeValue from '../components/AttributeValue'

export default {
  components: {
    AttributeValue
  },
  name: 'device',
  data () {
    return {
      selectedParam: '',
      deviceId: '',
      device: {
        site: [],
        deviceType: {
          actionTypes: {}
        },
        deviceAccount: {
        }
      }
    }
  },
  created: function () {
    this.deviceId = this.$route.params.id
    this.getDevice()
  },
  methods: {
    gotoGet (attribute) {
      this.$router.push({ path: '/home/devicegroups/get/' + this.deviceId + '/' + attribute })
    },
    gotoSet (attribute) {
      this.$router.push({ path: '/home/devicegroups/set/' + this.deviceId + '/' + attribute })
    },
    gotoAction (action) {
      this.$router.push({ path: '/home/devicegroups/action/' + this.deviceId + '/' + action })
    },
    getDevice () {
      let deviceUrl = '/devices/' + this.deviceId
      http('get', deviceUrl, '', (response) => {
        this.device = response.data
      })
    },
    refresh (done) {
      done()
      this.getDevice()
    }
  }
}
</script>

<style>
</style>
