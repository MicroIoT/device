<template>
  <q-page class="flex justify-center q-ma-md">
    <div style="width: 800px">
      <q-toolbar class="text-primary q-my-lg">
        <q-btn flat round dense icon="format_list_bulleted" />
        <q-toolbar-title>
          属性
        </q-toolbar-title>
      </q-toolbar>
      <q-card class="q-ma-md">
        <q-card-section>
          <q-list highlight separator>
            <q-item v-for="(attKey) in Object.keys(attDefinition)" :key="attKey" >
              <q-item-section avatar v-if="$q.screen.gt.xs">
                <q-icon color="primary" name="format_list_bulleted" />
              </q-item-section>
              <q-item-section @click="goto(attKey)" class="cursor-pointer">
                <q-item-label >{{attKey}}</q-item-label>
                <q-item-label caption>{{attDefinition[attKey].description}}</q-item-label>
              </q-item-section>
              <q-item-section side @click="goto(attKey)">
                <q-btn color="secondary" size="12px" flat dense round icon="info" >
                  <q-tooltip>详情</q-tooltip>
                </q-btn>
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
  name: 'attributes',
  data () {
    return {
    }
  },
  computed: {
    attDefinition () {
      let device = this.$store.getters.getCurrentUser
      return device.deviceType.attDefinition
    }
  },
  methods: {
    goto (name) {
      var page = {
        name: 'attribute',
        params: { name: name }
      }
      this.$router.push(page)
    }
  }
}
</script>

<style>
</style>
