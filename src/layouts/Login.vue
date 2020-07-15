<template>
  <q-layout >
    <q-page-container>
      <q-page padding class="column justify-center items-center" >
        <q-card inline style="width: 400px;">
          <div class="row justify-center q-mt-md cursor-pointer">
            <img alt="Quasar logo" src="statics/icons/favicon-96x96.png" @click="home">
          </div>
          <q-card-section class="text-center">
            <div class="text-h4">MicroIoT Device</div>
            <div class="text-subtitle2">登录开启物联网之旅</div>
          </q-card-section>
          <div class="q-ma-md">
            <q-input class="self-center full-width no-outline" v-model="form.username" autofocus
               label="用户"
               :error="$v.form.username.$error"
               error-message="用户名称不能为空"/>
            <q-input class="self-center full-width no-outline" type="password" v-model="form.password"
               label="密码"
               :error="$v.form.password.$error"
               error-message="密码不能为空"/>
            <div class="row" v-if="true">
              <div class="col-4"><q-select v-model="form.protocol"  :options="selectOptions"/></div>
              <div class="col-8"><q-input class="self-center full-width no-outline" v-model="form.server"
                label="服务器地址"
                :error="$v.form.server.$error"
                error-message="服务器地址不能为空"/></div>
            </div>
          </div>
          <q-card-actions  >
            <q-btn color="primary" style="width: 400px; max-width: 90vw" @click="login">登录</q-btn>
          </q-card-actions>
          <q-card-actions align="right">
            <q-btn flat color="primary" @click="studio" no-caps>MicroIoT Studio</q-btn>
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { http } from '../components/http'
import { initSystem } from '../components/util'

export default {
  name: 'login',
  data () {
    return {
      form: {
        username: '',
        password: '',
        server: 'www.microiot.top/server',
        protocol: 'iotps://'
      },
      selectOptions: [
        'iotp://', 'iotps://'
      ]
    }
  },
  created: function () {
    this.form.username = this.$route.params.username
    this.form.password = this.$route.params.password
  },
  validations: {
    form: {
      username: { required },
      password: { required },
      server: { required }
    }
  },
  methods: {
    studio () {
      window.location.href = 'https://www.microiot.top/studio'
    },
    home () {
      window.location.href = 'https://www.microiot.top'
    },
    login () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        return
      }
      let server = {
        host: this.form.server,
        protocol: this.form.protocol
      }
      this.$store.commit('server', server)

      let loginInfo = {
        'username': this.form.username,
        'password': this.form.password
      }

      http('post', '/login', loginInfo, (response) => {
        this.$store.commit('token', response.data)
        http('get', '/devices/me', '', (response) => {
          this.$store.commit('login', response.data)
          initSystem()
          this.$router.push({ path: '/home' })
        })
      })
    }
  }
}
</script>
