<template>
  <q-page class="flex justify-center q-ma-md">
    <div style="width: 800px">
      <q-toolbar class="text-primary q-my-lg">
        <q-btn flat round dense icon="arrow_back" @click="$router.back()"/>
        <q-toolbar-title>
          属性信息
        </q-toolbar-title>
      </q-toolbar>
      <q-card class="q-ma-md">
        <q-card-section>
          <q-list>
            <q-item >
              <q-item-section>
                <q-item-label>{{name}}</q-item-label>
                <q-item-label caption>{{attDefinition[name].description}}</q-item-label>
              </q-item-section>
              <q-item-section side><q-btn color="primary" @click="clickEdit" v-if="attDefinition[name].get || attDefinition[name].report">{{editText}}</q-btn></q-item-section>
            </q-item>
          </q-list>
          <q-card class="q-my-md">
            <q-list>
              <AttributeInput :attDefinition="attInput" ref="request" :edit="edit"/>
            </q-list>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import AttributeInput from '../components/AttributeInput.vue'

export default {
  components: {
    AttributeInput
  },
  name: 'attribute',
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
      getAttribute: 'getAttribute'
    }),
    editText () {
      if (!this.edit) {
        return '编辑'
      } else {
        return '确定'
      }
    },
    attInput () {
      let definition = {}
      definition[this.name] = this.attDefinition[this.name]
      return definition
    },
    attDefinition () {
      let device = this.$store.getters.getCurrentUser
      return device.deviceType.attDefinition
    }
  },
  methods: {
    clickEdit () {
      if (!this.edit) {
        this.edit = true
      } else {
        if (this.$refs.request.canSubmit()) {
          this.edit = false
          let value = this.$refs.request.getInputValue(false)
          this.$store.commit('setAttribute', value)
        }
      }
    }
  }
}
</script>

<style>
</style>
