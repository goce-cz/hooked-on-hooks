import React from 'react'
import { Paper, Tabs, Tab, AppBar, withStyles } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import codegen from 'babel-plugin-codegen/macro'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { useRouteParam } from './hooks'
import { ControlledInputHook } from './state/controlled_input_hook'
import { Section } from './section'
import { ClassRouteInput } from './route/route_input_class'
import { HookRouteInput } from './route/route_input_hook'
import { ControlledInputClass } from './state/controlled_input_class'
import { ExtractedHookRouteInput } from './route/route_input_hook_extracted'
import { ClassDebouncedInput } from './debounced/debounced_input_class'
import { HookDebouncedInput } from './debounced/debounced_input_hook'
import { ExtractedHookDebouncedInput } from './debounced/debounced_input_hook_extracted'
import { ClassReduxInput } from './redux/redux_input_class'
import { StoreDump } from './store_dump'
import { HookReduxInput } from './redux/redux_input_hook'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { ClockMemo } from './performance/clock_memo'
import { ClockUseMemo } from './performance/clock_use_memo'
import { Expensive } from './performance/expensive'
import { WikiSearch } from './async/wiki_search'
import { HookMounted } from './effect/mounted_hook'
import { ClassMounted } from './effect/mounted_class'
import { HookUpdated } from './effect/updated_hook'
import { ClassUpdated } from './effect/updated_class'
import { HookSubscription } from './effect/subscription_hook'
import { ExtractedHookSubscription } from './effect/subscription_hook_extracted'
import { ClassSubscription } from './effect/subscription_class'
import { StopwatchCallback } from './performance/stopwatch_callback'

const SECTIONS = [
  {
    title: 'State',
    samples: [
      {
        title: 'Class powered',
        component: ControlledInputClass,
        source: codegen.require('../macros/import_source', './state/controlled_input_class.js')
      },
      {
        title: 'Hook powered',
        component: ControlledInputHook,
        source: codegen.require('../macros/import_source', './state/controlled_input_hook.js')
      }
    ]
  },
  {
    title: 'Effect',
    samples: [
      {
        title: 'Component did mount - hook',
        component: HookMounted,
        source: codegen.require('../macros/import_source', './effect/mounted_hook.js')
      },
      {
        title: 'Component did mount - class',
        component: ClassMounted,
        source: codegen.require('../macros/import_source', './effect/mounted_class.js')
      },
      {
        title: 'Updated - hook',
        component: HookUpdated,
        source: codegen.require('../macros/import_source', './effect/updated_hook.js')
      },
      {
        title: 'Updated - class',
        component: ClassUpdated,
        source: codegen.require('../macros/import_source', './effect/updated_class.js')
      },
      {
        title: 'Subscription - hook',
        component: HookSubscription,
        source: codegen.require('../macros/import_source', './effect/subscription_hook.js')
      },
      {
        title: 'Subscription - class',
        component: ClassSubscription,
        source: codegen.require('../macros/import_source', './effect/subscription_class.js')
      },
      {
        title: 'Subscription - hook extracted',
        component: ExtractedHookSubscription,
        source: codegen.require('../macros/import_source', './effect/subscription_hook_extracted.js')
      }
    ]
  },
  {
    title: 'Route',
    samples: [
      {
        title: 'Class powered',
        component: ClassRouteInput,
        source: codegen.require('../macros/import_source', './route/route_input_class.js')
      },
      {
        title: 'Hook powered',
        component: HookRouteInput,
        source: codegen.require('../macros/import_source', './route/route_input_hook.js')
      },
      {
        title: 'Powered by extracted hook',
        component: ExtractedHookRouteInput,
        source: codegen.require('../macros/import_source', './route/route_input_hook_extracted.js')
      }
    ]
  },
  {
    title: 'Debounced',
    samples: [
      {
        title: 'Class powered',
        component: ClassDebouncedInput,
        source: codegen.require('../macros/import_source', './debounced/debounced_input_class.js')
      },
      {
        title: 'Hook powered',
        component: HookDebouncedInput,
        source: codegen.require('../macros/import_source', './debounced/debounced_input_hook.js')
      },
      {
        title: 'Powered by extracted hook',
        component: ExtractedHookDebouncedInput,
        source: codegen.require('../macros/import_source', './debounced/debounced_input_hook_extracted.js')
      }
    ]
  },
  {
    title: 'Redux',
    samples: [
      {
        title: 'Class powered',
        component: ClassReduxInput,
        source: codegen.require('../macros/import_source', './redux/redux_input_class.js')
      },
      {
        title: 'Hook powered',
        component: HookReduxInput,
        source: codegen.require('../macros/import_source', './redux/redux_input_hook.js')
      }
    ],
    footerComponent: StoreDump
  },
  {
    title: 'Performance',
    samples: [
      {
        title: 'Expensive computation',
        component: Expensive,
        source: codegen.require('../macros/import_source', './performance/expensive.js')
      },
      {
        title: 'memo() is the new PureComponent',
        component: ClockMemo,
        source: codegen.require('../macros/import_source', './performance/clock_memo.js')
      },
      {
        title: 'Bail out of rendering with useMemo()',
        component: ClockUseMemo,
        source: codegen.require('../macros/import_source', './performance/clock_use_memo.js')
      },
      {
        title: 'Callbacks',
        component: StopwatchCallback,
        source: codegen.require('../macros/import_source', './performance/stopwatch_callback.js')
      }
    ]
  },
  {
    title: 'Async',
    samples: [
      {
        title: 'Wiki search',
        component: WikiSearch,
        source: codegen.require('../macros/import_source', './async/wiki_search.js')
      }
    ]
  }
]

const styled = withStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  tabs: {
    flex: 2
  },
  sourcePaper: {
    flex: 0,
    zIndex: 1,
    flexBasis: '50%',
    padding: theme.spacing.unit * 2
  },
  sourceWrapper: {
    position: 'relative',
    height: '100%',
    width: '100%',
    overflowY: 'auto'
  },
  sourceContent: {
    '& h3': {
      marginTop: 0,
      paddingTop: theme.spacing.unit
    },
    '&.enter': {
      position: 'absolute',
      zIndex: 500,
      overflow: 'hidden',
      opacity: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    '&.enter-active': {
      transition: 'opacity 300ms ease',
      opacity: 1
    },
    '&.exit-active': {
      transition: 'opacity 300ms ease',
      opacity: 0
    }
  },

}))

export const Sections = styled(({ classes }) => {
  const [tabIndex, setTabIndex] = useRouteParam('tabIndex', 0)
  const handleTabChange = (event, index) => setTabIndex(index)
  const selectedSection = SECTIONS[tabIndex]
  return (
    <div className={classes.wrapper}>
      <div className={classes.tabs}>
        <AppBar position="static" color="default">
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {
              SECTIONS.map((section, index) => <Tab key={index} label={section.title}/>)
            }
          </Tabs>
        </AppBar>
        <SwipeableViews
          index={tabIndex}
          onChangeIndex={setTabIndex}
        >
          {
            SECTIONS.map((section, index) => (
              <Section key={index} sectionIndex={index} section={section}/>
            ))
          }
        </SwipeableViews>
      </div>
      <Paper square className={classes.sourcePaper}>
        <TransitionGroup className={classes.sourceWrapper}>
          <CSSTransition key={tabIndex} timeout={300}>
            <div className={classes.sourceContent}>
              {
                selectedSection &&
                selectedSection.samples.map((sample, index) => (
                  <div key={index}>
                    <h3 id={`section-${tabIndex}-sample-${index}`}>{sample.title}</h3>
                    <SyntaxHighlighter language='javascript'>{sample.source}</SyntaxHighlighter>
                  </div>
                ))
              }
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Paper>
    </div>
  )
})
