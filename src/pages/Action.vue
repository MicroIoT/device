<template>
  <q-page class="flex justify-center q-ma-md">
    <div style="width: 800px">
      <q-toolbar class="text-primary q-my-lg">
        <q-btn flat round dense icon="arrow_back" @click="$router.back()"/>
        <q-toolbar-title>
          操作信息
        </q-toolbar-title>
      </q-toolbar>
      <q-card class="q-ma-md">
        <q-card-section>
          <q-list>
            <q-item >
              <q-item-section>
                <q-item-label>{{name}}</q-item-label>
                <q-item-label caption>{{actionDefinition[name].description}}</q-item-label>
              </q-item-section>
              <q-item-section top side>
                <div class="q-gutter-xs">
                  <q-btn @click="edit = false;$refs.response.hide()" flat color="primary" v-if="edit">取消</q-btn>
                  <q-btn color="primary" @click="clickEdit">
                    {{editText}}
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card class="q-my-md">
            <q-expansion-item
              class="q-ma-md"
              switch-toggle-side
              header-class="text-primary"
              label="请求信息">
              <DataValue :dataValue="getActionRequest(name)" />
            </q-expansion-item>
            <q-separator />
            <q-expansion-item
              ref="response"
              class="q-ma-md"
              switch-toggle-side
              header-class="text-primary"
              label="响应信息">
              <DataValue :dataValue="getActionResponse(name)" v-if="!edit"/>
              <AttributeInput :attDefinition="responseDefinition" ref="responseInput" :edit="edit" v-if="edit"/>
            </q-expansion-item>
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

export default {
  components: {
    AttributeInput, DataValue
  },
  name: 'action',
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
      getActionRequest: 'getActionRequest',
      getActionResponse: 'getActionResponse'
    }),
    editText () {
      if (!this.edit) {
        return '编辑'
      } else {
        return '保存'
      }
    },
    responseDefinition () {
      return this.actionDefinition[this.name].response
    },
    actionDefinition () {
      let device = this.$store.getters.getCurrentUser
      return device.deviceType.actionTypes
    }
  },
  methods: {
    clickEdit () {
      if (!this.edit) {
        this.$refs.response.show()
        this.edit = true
      } else {
        if (this.$refs.responseInput.canSubmit()) {
          this.edit = false
          this.$refs.response.hide()
          let value = this.$refs.responseInput.getInputValue(false)
          let response = {}
          response[this.name] = value
          this.$store.commit('setActionResponse', response)
        }
      }
    }
  }
}
</script>

<style>
</style>
