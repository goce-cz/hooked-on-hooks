import React from 'react'
import { Tabs, Tab, AppBar, withStyles } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import codegen from 'babel-plugin-codegen/macro'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

import { useRouteParam } from './hooks'
import Paper from '@material-ui/core/Paper'
import { ControlledInputHook } from './state/controlled_input_hook'
import { Section } from './section'
import { RouteInputClass } from './route/route_input_class'
import { RouteInputHook } from './route/route_input_hook'
import { ControlledInputClass } from './state/controlled_input_class'
import { RouteInputHookExtracted } from './route/route_input_hook_extracted'
import { DebouncedInputClass } from './debounced/debounced_input_class'
import { DebouncedInputHook } from './debounced/debounced_input_hook'
import { DebouncedInputHookExtracted } from './debounced/debounced_input_hook_extracted'
import { ReduxInputClass } from './redux/redux_input_class'
import { StoreDump } from './store_dump'
import { ReduxInputHook } from './redux/redux_input_hook'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { ClockMemo } from './performance/clock_memo'
import { ClockUseMemo } from './performance/clock_use_memo'
import { Expensive } from './performance/expensive'

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
    title: 'Route',
    samples: [
      {
        title: 'Class powered',
        component: RouteInputClass,
        source: codegen.require('../macros/import_source', './route/route_input_class.js')
      },
      {
        title: 'Hook powered',
        component: RouteInputHook,
        source: codegen.require('../macros/import_source', './route/route_input_hook.js')
      },
      {
        title: 'Powered by extracted hook',
        component: RouteInputHookExtracted,
        source: codegen.require('../macros/import_source', './route/route_input_hook_extracted.js')
      }
    ]
  },
  {
    title: 'Debounced',
    samples: [
      {
        title: 'Class powered',
        component: DebouncedInputClass,
        source: codegen.require('../macros/import_source', './debounced/debounced_input_class.js')
      },
      {
        title: 'Hook powered',
        component: DebouncedInputHook,
        source: codegen.require('../macros/import_source', './debounced/debounced_input_hook.js')
      },
      {
        title: 'Powered by extracted hook',
        component: DebouncedInputHookExtracted,
        source: codegen.require('../macros/import_source', './debounced/debounced_input_hook_extracted.js')
      }
    ]
  },
  {
    title: 'Redux',
    samples: [
      {
        title: 'Class powered',
        component: ReduxInputClass,
        source: codegen.require('../macros/import_source', './redux/redux_input_class.js')
      },
      {
        title: 'Hook powered',
        component: ReduxInputHook,
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
