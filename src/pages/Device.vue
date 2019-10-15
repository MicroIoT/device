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
              <template v-slot:control  @click="gotoDeviceType(device.deviceType.id)">
                <div class="self-center full-width no-outline" tabindex="0">{{$store.getters.getCurrentUser.deviceType.name}}</div>
              </template>
              <template v-slot:append>
                <q-btn color="secondary" size="12px" flat dense round icon="info" @click="gotoDeviceType(device.deviceType.id)">
                </q-btn>
              </template>
          </q-field>
          <q-field stack-label class="q-ma-md" label="设备场地">
            <template v-slot:prepend>
              <q-icon name="event" color="primary"/>
            </template>
            <template v-slot:control  @click="gotoSite(device.location)">
              <div class="self-center full-width no-outline" tabindex="0">{{getLocation}}</div>
            </template>
          </q-field>

            <AttributeValue title="设备静态属性" :attributeValue="device.attributes" v-if="device.attributes && Object.keys(device.attributes).length > 0"/>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import AttributeValue from '../components/AttributeValue'

export default {
  components: {
    AttributeValue
  },
  name: 'device',
  data () {
    return {
      myDevice: false,
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
  computed: {
    getLocation () {
      let device = this.$store.getters.getCurrentUser
      let location = device.location.type === 'site' ? device.location.string : '/'
      return device.domain.name + ':' + location
    }
  },
  methods: {
    gotoSite (site) {
      if (site.type === 'domain') {
        this.$router.push({ path: '/home/sites/root' })
      } else {
        this.$router.push({ path: '/home/sites/' + site.id })
      }
    },
    gotoDeviceType (devicetypeId) {
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
