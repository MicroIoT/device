
const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('layouts/Login.vue')
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '',
        name: 'home',
        component: () => import('pages/Index.vue')
      },
      { path: 'device',
        name: 'device',
        component: () => import('pages/Device.vue')
      },
      { path: 'devicetype',
        name: 'devicetype',
        component: () => import('pages/DeviceType.vue')
      },
      { path: 'attributes',
        name: 'attributes',
        component: () => import('pages/Attributes.vue')
      },
      { path: 'attributes/attribute/:name',
        name: 'attribute',
        component: () => import('pages/Attribute.vue')
      },
      { path: 'actions',
        name: 'actions',
        component: () => import('pages/Actions.vue')
      },
      { path: 'actions/action/:name',
        name: 'action',
        component: () => import('pages/Action.vue')
      },
      { path: 'alarms',
        name: 'alarms',
        component: () => import('pages/Alarms.vue')
      },
      { path: 'alarms/alarm/:name',
        name: 'alarm',
        component: () => import('pages/Alarm.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
