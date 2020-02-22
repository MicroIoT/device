<template>
  <q-page class="flex justify-center q-ma-md">
    <div style="width: 800px">
      <q-toolbar class="text-primary q-my-lg">
        <q-btn flat round dense icon="group_work" />
        <q-toolbar-title>
          设备组
        </q-toolbar-title>
        <q-btn flat round dense icon="refresh" @click="refresh">
          <q-tooltip>刷新</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-card class="q-ma-md" v-if="deviceGroups.length > 0">
        <q-card-section>
          <q-list highlight separator>
            <q-item v-for="deviceGroup in deviceGroups" :key="deviceGroup.id" >
              <q-item-section avatar v-if="$q.screen.gt.xs">
                <q-icon color="primary" name="group_work" />
              </q-item-section>
              <q-item-section @click="goto(deviceGroup.id)" class="cursor-pointer">
                <q-item-label >{{deviceGroup.name}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { http } from '../components/http'

export default {
  name: 'device-groups',
  data () {
    return {
      deviceGroups: []
    }
  },
  created: function () {
    this.getDeviceGroup()
  },
  methods: {
    goto (id) {
      var page = {
        name: 'devicegroup',
        params: { id: id }
      }
      this.$router.push(page)
    },
    refresh () {
      this.deviceGroups = []
      this.getDeviceGroup()
    },
    getDeviceGroup () {
      http('get', '/devicegroups/me', null, (response) => {
        this.deviceGroups = response.data
      })
    }
  }
}
</script>

<style>
</style>
