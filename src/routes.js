import createRouter from 'router5'
import browserPlugin from 'router5-plugin-browser'

export const DEFAULT_ROUTE = 'default'

export const router = createRouter(
  [{ name: DEFAULT_ROUTE, path: '/?:tabIndex&:value&:wikiSearch' }],
  { defaultRoute: DEFAULT_ROUTE }
)

router.usePlugin(
  browserPlugin()
)
