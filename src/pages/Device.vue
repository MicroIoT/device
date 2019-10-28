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

            <AttributeValue title="设备静态属性" :attributeValue="$store.getters.getCurrentUser.attributes" v-if="$store.getters.getCurrentUser.attributes && Object.keys($store.getters.getCurrentUser.attributes).length > 0"/>
            <q-expansion-item
              class="q-ma-md"
              switch-toggle-side
              expand-separator
              header-class="text-primary"
              label="我的设备组"
              v-if="deviceGroups && deviceGroups.length > 0">
              <q-list separator>
                  <q-expansion-item
                    class="q-ma-md"
                    switch-toggle-side
                    expand-separator
                    header-class="text-primary"
                    :label="deviceGroup.name"
                    v-for="deviceGroup in deviceGroups" :key="deviceGroup.id">
                    <q-card class="q-ma-md">
                      <q-list separator>
                        <q-item v-for="device in deviceGroup.devices" :key="device.id">
                          <q-item-section avatar v-if="$q.screen.gt.xs">
                            <q-icon color="primary" :name="device.connected?'devices':'phonelink_off'" />
                          </q-item-section>
                          <q-item-section @click="gotoDevice(device.id)" class="cursor-pointer">
                            <q-item-label>{{device.name}}</q-item-label>
                            <q-item-label caption>{{device.deviceType.name}}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card>
                  </q-expansion-item>
              </q-list>
            </q-expansion-item>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import AttributeValue from '../components/AttributeValue'
import { http } from '../components/http'

export default {
  components: {
    AttributeValue
  },
  name: 'device',
  data () {
    return {
      deviceGroups: ''
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
    this.getDeviceGroup()
  },
  methods: {
    getDeviceGroup () {
      http('get', '/devicegroups/me', null, (response) => {
        this.deviceGroups = response.data
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
