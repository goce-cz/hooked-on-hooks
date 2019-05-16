import { useCallback, useState, useRef, useEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'
import identity from 'lodash/identity'
import { useRouter } from 'react-router5'

const isTrue = val => val === 'true'

const inferParamParser = defaultValue => {
  if (typeof defaultValue === 'number') {
    return Number
  } else if (typeof defaultValue === 'boolean') {
    return isTrue
  } else {
    return identity
  }
}

const parseParamValue = (paramValue, defaultValue, parser) => {
  const parsedParamValue = typeof paramValue === 'string' ? parser(paramValue) : paramValue
  return paramValue === undefined ? defaultValue : parsedParamValue
}

/**
 * Similar to `useState` but uses a route parameter as state container.
 * Note that this uses *current route* in the sense of `RouteStack` component.
 * When the value is changed to `defaultValue`, the param is in fact removed from the route.
 *
 * When a default value (other than `null` or `undefined`) is used, the hook will infer the data-type from it
 * and will ensure that it always returns that correct data type. So in case of:
 *
 * ```javascript
 * const numeric = useRouteParam('someParam', 0)
 * ```
 *
 * the `numeric` will always be a `Number`, because the type is inferred from the default value.
 *
 * When using `null` or `undefined` as a default value the automatic inference is not possible,
 * therefore one is forced to pass a parser function manually:
 *
 * ```javascript
 * const numericOrNull = useRouteParam('someParam', null, stringValue => Number(stringValue))
 * ```
 *
 * or simply:
 *
 * ```javascript
 * const numericOrNull = useRouteParam('someParam', null, Number)
 * ```
 * @param paramName name of a route parameter
 * @param [defaultValue] default value in case the parameter is not present
 * @param [parser] parser function for the value - should covert a string coming from the URL to a desired data-type
 * @returns {*[]} current value and a function to change it
 */
export const useRouteParam = (paramName, defaultValue = null, parser = inferParamParser(defaultValue)) => {
  const router = useRouter()

  const parserRef = useRef(parser)
  parserRef.current = parser
  const defaultValueRef = useRef(parser)
  defaultValueRef.current = defaultValue

  const [snapshot, setSnapshot] = useState(() => {
    const route = router.getState()
    return parseParamValue(route && route.params[paramName], defaultValue, parser)
  })

  useEffect(
    () => {
      const subscription = router.subscribe({
        next: ({route}) => {
          const parsedValue = parseParamValue(route && route.params[paramName], defaultValueRef.current, parserRef.current)
          setSnapshot(parsedValue)
        }
      })
      return () => subscription.unsubscribe()
    },
    [router, paramName, setSnapshot, parserRef, defaultValueRef]
  )

  const setValue = useCallback(
    (newValue, pushToHistory) => {
      const route = router.getState()
      return new Promise(
        resolve => router.navigate(
          route.name,
          { ...route.params, [paramName]: newValue === defaultValue ? undefined : newValue },
          { replace: !pushToHistory },
          resolve
        ))
    },
    [paramName, defaultValue, router]
  )
  return [snapshot, setValue]
}

/**
 * Debounce changes to any value.
 *
 * @param value current (persisted) value
 * @param setValue callback to change the persisted value
 * @param delay debounce delay
 * @param deps optional additional dependencies that allow you to cancel debounce when important input properties change
 * @returns {any[]} interim value, debounced function for changing the value and a function that flushes the value immediately
 */
export const useDebounce = (value, setValue, delay, deps = []) => {
  const [interim, setInterim] = useState(value)
  const debouncedSetValueRef = useRef(null)

  useEffect(
    () => {
      // this updates the interim value whenever the persisted one or any dependency changes
      setInterim(value)
      if (debouncedSetValueRef.current) {
        debouncedSetValueRef.current.cancel()
      }
      // eslint-disable-next-line
    }, [value, setInterim, ...deps]
  )

  useEffect(
    () => {
      debouncedSetValueRef.current = debounce(
        newValue => setValue(newValue),
        delay
      )
      return () => {
        // any pending call to the debounced function will be canceled
        // when any of the dependencies change
        debouncedSetValueRef.current.cancel()
      }
    },
    // eslint-disable-next-line
    [setValue, debouncedSetValueRef, delay, ...deps]
  )

  const setDebounced = useCallback(
    newValue => {
      setInterim(newValue)
      debouncedSetValueRef.current(newValue)
    },
    [setInterim, debouncedSetValueRef]
  )

  const setImmediate = useCallback(
    newValue => {
      setDebounced(newValue)
      debouncedSetValueRef.current.flush()
    },
    [setDebounced, debouncedSetValueRef]
  )

  return [interim, setDebounced, setImmediate]
}

/**
 * The returned value is a delayed/debounced/slowed down version of the `immediateValue` argument.
 * Whenever the `immediateValue` changes, the hooks wait for a given amount of milliseconds before propagating
 * the change to the output.
 *
 * **Important:** When the `immediateValue` is falsy, it is propagated immediately.
 * This makes it easy to use this function for various throbbers which should be displayed with a delay,
 * but hidden immediately.
 *
 * @param immediateValue a value that keeps changing frequently
 * @param delay a delay in milliseconds before a change in `immediateValue` gets propagated to the output
 * @returns {any} returns `immediateValue` at the first call and then a delayed version of it
 */
export const useDelayedValue = (immediateValue, delay) => {
  const [delayedValue, setDelayedValue] = useState(immediateValue)
  const debouncedSetDelayedValue = useRef()
  const lastValue = useRef(immediateValue)

  useEffect(
    () => {
      debouncedSetDelayedValue.current = debounce(
        newValue => setDelayedValue(newValue),
        delay
      )
      return () => {
        // calling setDelayedValue is illegal after unmounting, so let's cancel any pending change
        debouncedSetDelayedValue.current.cancel()
      }
    },
    [setDelayedValue, delay]
  )

  if (lastValue.current !== immediateValue) {
    lastValue.current = immediateValue
    debouncedSetDelayedValue.current(immediateValue)
    if (!immediateValue) {
      debouncedSetDelayedValue.current.flush()
    }
  }
  return delayedValue
}

/**
 * Caches previous `value` for usages when current `value` is not available.
 * Availability of `value` is by default determined using `value != null`.
 * If more specific control is required, the second argument is here to the rescue.
 * Passing truthy value to `isAvailable` marks the provided `value` as available,
 * while falsy will make the function return the cached one.
 *
 * @param {*} value value to be cached
 * @param {boolean} isAvailable
 * @returns {*} either cached or the provided `value`, based on availability
 */
export const useLastAvailable = (value, isAvailable = value != null) => {
  const lastDataRef = useRef(value)

  if (isAvailable) {
    lastDataRef.current = value
    return value
  } else {
    return lastDataRef.current
  }
}

/**
 * Returns snapshot of the current state of a promise:
 * - `{value: ...}` when the promise has been resolved
 * - `{error: ...}` when the promise has been rejected
 * - `{pending: true}` while the promise is neither resolved nor rejected
 *
 * @param promise
 * @returns {{pending?: boolean, value?: *, error?: Error}}
 */
export const useAsync = promise => {
  const [result, setResult] = useState({ pending: true })
  useEffect(
    () => {
      setResult({ pending: true })
      let canceled = false
      promise
        .then(
          value => {
            if (!canceled) {
              setResult({ value })
            }
          },
          error => {
            if (!canceled) {
              setResult({ error })
            }
          }
        )
      return () => {
        canceled = true
      }
    },
    [promise]
  )
  return result
}

/**
 * Executes an asynchronous task and returns snapshot of its current state.
 * See `useAsync()` for details about the shape of the snapshot object.
 *
 * @param task an asynchronous function
 * @param deps array of dependencies for the task (task is re-executed anytime any of the deps changes)
 * @returns {{pending?: boolean, value?: *, error?: Error}}
 */
export const useTask = (task, deps) => {
  const promise = useMemo(
    () => task(),
    // eslint-disable-next-line
    deps
  )
  return useAsync(promise)
}
