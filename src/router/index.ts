import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/message',
      children: [
        {
          path: 'message',
          component: () => import('@/views/Message/Index.vue'),
          children: [
            {
              path: 'chat',
              name: 'chat',
              component: () => import('@/views/Message/Chat.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/contact',
      meta: { requireLogin: true },
      component: () => import('@/views/Contact/Index.vue'),
      children: [
        {
          path: 'info',
          component: () => import('@/views/Contact/ContactInfo.vue')
        },
        {
          path: 'newContact',
          component: () => import('@/views/Contact/NewContact.vue')
        }
      ]
    },
    {
      path: '/search',
      meta: { requireLogin: true },
      component: () => import('@/views/Search/Index.vue'),
      children: [
        {
          path: 'info',
          component: () => import('@/views/Search/SearchInfo.vue')
        }
      ]
    },
    {
      path: '/setting',
      component: () => import('@/views/Setting/Index.vue'),
      children: [
        {
          path: 'login',
          component: () => import('@/views/Setting/Login.vue')
        },
        {
          path: 'register',
          component: () => import('@/views/Setting/Register.vue')
        },
        {
          path: 'config',
          component: () => import('@/views/Setting/Config.vue')
        },
        {
          path: 'about',
          component: () => import('@/views/Setting/About.vue')
        },
        {
          path: 'user',
          meta: { requireLogin: true },
          component: () => import('@/views/Setting/User.vue')
        }, {
          path: 'reset',
          component: () => import('@/views/Setting/Resetting.vue')
        }
      ]
    }
  ]
})

router.beforeEach(to => to.meta.requireLogin ? useUserStore().isLogin : true)
export default router
