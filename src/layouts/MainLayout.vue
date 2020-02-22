<template>
  <q-layout view="hHh LpR lFr">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs">
          <img src="statics/icons/favicon-32x32.png" size="28px" />
          <q-toolbar-title>
            MicroIoT Device
          </q-toolbar-title>
        </q-btn>
        <q-space />
        <div class="q-gutter-sm row items-center">
          <q-btn round flat icon="person">
            <q-menu fit>
              <q-list separator>
                <q-item clickable v-close-popup to="/home/device">
                  <q-item-section avatar>
                    <q-icon color="primary" name="person" />
                  </q-item-section>
                  <q-item-section>{{$store.getters.getCurrentUser.string}}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="exit">
                  <q-item-section avatar>
                    <q-icon color="red" name="exit_to_app" />
                  </q-item-section>
                  <q-item-section>退出系统</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      :width="180"
    >
      <q-scroll-area class="fit">
        <q-list padding >
          <q-item clickable v-ripple to="/home" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>首页</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced inset/>
          <q-item clickable v-ripple to="/home/attributes">
            <q-item-section avatar>
              <q-icon name="format_list_bulleted"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>属性</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/home/actions">
            <q-item-section avatar>
              <q-icon name="call_to_action"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>操作</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/home/alarms">
            <q-item-section avatar>
              <q-icon name="notification_important" >
              </q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>告警</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/home/devicegroups">
            <q-item-section avatar>
              <q-icon name="group_work" >
              </q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>设备组</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import { initSystem } from '../components/util'
import { stomp } from '../components/stomp'

export default {
  name: 'main-layout',

  data () {
    return {
      leftDrawerOpen: false
    }
  },
  beforeCreate () {
    window.addEventListener('load', (event) => {
      initSystem()
    })
  },
  computed: {
    ...mapGetters({
      timers: 'getAllTimer',
      subscribers: 'getAllSubscriber'
    })
  },
  methods: {
    exit () {
      let value = {}
      for (var key of Object.keys(this.timers)) {
        clearInterval(this.timers[key])
        value[key] = null
        this.$store.commit('setTimer', value)
      }
      for (var sub of Object.keys(this.subscribers)) {
        if (this.subscribers[sub] !== null) {
          stomp.unsubscribe(this.subscribers[sub])
          value[sub] = null
          this.$store.commit('setSubscriber', value)
        }
      }
      stomp.disconnect()
      this.$store.commit('logout')
      this.$store.commit('quit')
      this.$router.push('/')
    }
  }
}
</script>
