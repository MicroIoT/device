
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
      { path: 'alarms',
        name: 'alarms',
        component: () => import('pages/Alarms.vue')
      },
      { path: 'logs',
        name: 'logs',
        component: () => import('pages/Logs.vue')
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
