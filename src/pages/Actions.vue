<template>
  <q-page class="flex justify-center q-ma-md">
    <div style="width: 800px">
      <q-toolbar class="text-primary q-my-lg">
        <q-btn flat round dense icon="call_to_action" />
        <q-toolbar-title>
          操作
        </q-toolbar-title>
      </q-toolbar>
      <q-card class="q-ma-md">
        <q-card-section>
          <q-list highlight separator>
            <q-item v-for="(actionKey) in Object.keys(actionTypes)" :key="actionKey" >
              <q-item-section avatar v-if="$q.screen.gt.xs">
                <q-icon color="primary" name="call_to_action" />
              </q-item-section>
              <q-item-section @click="goto(actionKey)" class="cursor-pointer">
                <q-item-label >{{actionKey}}</q-item-label>
                <q-item-label caption>{{actionTypes[actionKey].description}}</q-item-label>
              </q-item-section>
              <q-item-section side >
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn color="secondary" size="12px" flat dense round icon="info" @click="goto(actionKey)">
                    <q-tooltip>详情</q-tooltip>
                  </q-btn>
                  <q-btn color="secondary" size="12px" flat dense round icon="more" @click="gotoDeviceType">
                    <q-tooltip>定义</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'actions',
  data () {
    return {
    }
  },
  computed: {
    actionTypes () {
      let device = this.$store.getters.getCurrentUser
      return device.deviceType.actionTypes
    }
  },
  methods: {
    goto (name) {
      var page = {
        name: 'action',
        params: { name: name }
      }
      this.$router.push(page)
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
