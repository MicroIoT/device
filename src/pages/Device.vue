<template>
  <q-page class="flex justify-center q-ma-md">
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
                <q-icon color="primary"  name="devices" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{$store.getters.getCurrentUser.string}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card>
            <q-field stack-label class="q-ma-md" label="设备类型">
              <template v-slot:prepend>
                <q-icon name="event" color="primary"/>
              </template>
              <template v-slot:control  >
                <div @click="gotoDeviceType()" class="self-center full-width no-outline" tabindex="0">{{$store.getters.getCurrentUser.deviceType.name}}</div>
              </template>
              <template v-slot:append>
                <q-btn color="secondary" size="12px" flat dense round icon="info" @click="gotoDeviceType()">
                </q-btn>
              </template>
          </q-field>
          <q-field stack-label class="q-ma-md" label="设备场地">
            <template v-slot:prepend>
              <q-icon name="event" color="primary"/>
            </template>
            <template v-slot:control  >
              <div class="self-center full-width no-outline" tabindex="0">{{getLocation}}</div>
            </template>
          </q-field>
          <q-field stack-label class="q-ma-md" label="网关" v-if="$store.getters.getCurrentUser.gateway !== null">
            <template v-slot:prepend>
              <q-icon name="event" color="primary"/>
            </template>
            <template v-slot:control  @click="select($store.getters.getCurrentUser.gateway)">
              <div @click="select($store.getters.getCurrentUser.gateway)" class="self-center full-width no-outline" tabindex="0">{{$store.getters.getCurrentUser.gateway.string}}</div>
            </template>
            <template v-slot:append>
              <q-btn color="primary" @click="select($store.getters.getCurrentUser.gateway)">切换</q-btn>
            </template>
          </q-field>
            <q-expansion-item
              class="q-ma-md"
              switch-toggle-side
              expand-separator
              header-class="text-primary"
              label="子设备"
              v-if="subdevices.length > 0">
              <q-list separator>
                <q-item v-for="(value, key) in subdevices" :key="key">
                  <q-item-section avatar>
                    <q-icon color="primary" name="devices" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label @click="select(value)" class="cursor-pointer">{{value.string}}</q-item-label>
                  </q-item-section>
                  <q-item-section side >
                    <q-btn color="primary" @click="select(value)">切换</q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <AttributeValue title="设备静态属性" :attributeValue="$store.getters.getCurrentUser.attributes" v-if="$store.getters.getCurrentUser.attributes && Object.keys($store.getters.getCurrentUser.attributes).length > 0"/>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import AttributeValue from '../components/AttributeValue'
import { http } from '../components/http'
import { stomp } from '../components/stomp'
import { initStore } from '../components/util'

export default {
  components: {
    AttributeValue
  },
  name: 'device',
  data () {
    return {
      subdevices: []
    }
  },
  computed: {
    getLocation () {
      let device = this.$store.getters.getCurrentUser
      let location = device.location.type === 'site' ? device.location.string : '/'
      return device.domain.name + ':' + location
    }
  },
  created: function () {
    this.getSubDevices()
  },
  methods: {
    select (device) {
      stomp.unSubscription()
      this.$store.commit('login', device)
      this.getSubDevices()
      stomp.manageSubscription()
      initStore()
    },
    getSubDevices () {
      let url = '/devices/subdevice/' + this.$store.getters.getCurrentUser.id
      http('get', url, '', (response) => {
        this.subdevices = response.data
      })
    },
    gotoDeviceType () {
      var page = {
        name: 'devicetype'
      }
      this.$router.push(page)
    }
  }
}
</script>

<style>
</style>
