<template>
  <q-page class="flex justify-center q-ma-md">
    <q-dialog v-model="showDialog" persistent>
      <q-card style="width: 800px; max-width: 80vw;">
        <q-toolbar class="text-primary">
          <q-toolbar-title>
            告警详细信息
          </q-toolbar-title>
          <q-space />
          <q-btn icon="close" flat round dense @click="$router.back()" />
        </q-toolbar>
        <q-card class="q-ma-md">
          <q-card-section>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>告警对象</q-item-label>
                  <q-item-label >{{alarm(alarmId).notifyObject.string}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>告警类型</q-item-label>
                  <q-item-label >{{alarm(alarmId).alarmType}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>告警上报时间</q-item-label>
                  <q-item-label >{{alarm(alarmId).reportTime}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>告警接收时间</q-item-label>
                  <q-item-label >{{alarm(alarmId).receiveTime}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-card class="q-my-md">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label caption>告警信息</q-item-label>
                    <DataValue :dataValue="alarm(alarmId).alarmInfo" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-card-section>
        </q-card>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import DataValue from '../components/DataValue.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'alarminfo',
  components: {
    DataValue
  },
  data () {
    return {
      showDialog: false,
      alarmId: ''
    }
  },
  created () {
    this.alarmId = this.$route.params.alarmid
    this.showDialog = true
  },
  computed: {
    ...mapGetters({
      alarm: 'getMyalarm'
    })
  },
  methods: {
  }
}
</script>

<style>
</style>
