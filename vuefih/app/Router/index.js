const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App,
    },
    {
      path: '/Login',
      name: 'Log In',
      component: App,
    },
    {
      path: '/SignIn',
      name: 'Sign In',
      component: SignIn
    }
  ]
})

export default router
