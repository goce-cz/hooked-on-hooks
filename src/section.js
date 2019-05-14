import React from 'react'
import { Paper, withStyles } from '@material-ui/core'

const styled = withStyles(theme => ({
  paper: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2
  }
}))

export const Section = styled(({ classes, sectionIndex, section }) => (
  <Paper className={classes.paper}>
    {
      section.samples.map((sample, index) => (
        <div key={index}>
          <h3>{sample.title} <a href={`#section-${sectionIndex}-sample-${index}`}>(source)</a></h3>
          <sample.component key={index}/>
        </div>
      ))
    }
    {section.footerComponent && <section.footerComponent/>}
  </Paper>
))
