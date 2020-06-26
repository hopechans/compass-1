import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import {createMuiTheme, ExpansionPanelActions} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import Divider from '@material-ui/core/Divider';

const theme = createMuiTheme({
  overrides: {
    MuiExpansionPanelDetails: {
      root: {
        display: "gird",
      }
    },
    MuiPaper: {
      root: {
        color: ""
      },
    }
  },
});

export interface CollapseProps {
  useExpandIcon?: boolean,
  useDivider?: boolean,
  extraExpand?: React.ReactNode,
  panelName?: React.ReactNode
  panelAction?: React.ReactNode
}

const defaultProps: CollapseProps = {
  useExpandIcon: true,
  useDivider: true,
}

export class Collapse extends React.Component<CollapseProps> {

  static defaultProps = defaultProps as object;

  render() {
    const {useExpandIcon, useDivider, panelName, panelAction, extraExpand, children} = this.props;

    return (
      <ThemeProvider theme={theme}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={
              <>
                {extraExpand}
                {useExpandIcon ? <ExpandMoreIcon/> : null}
              </>
            }
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            {panelName}
          </ExpansionPanelSummary>
          {useDivider ? <Divider/> : null}
          <ExpansionPanelDetails>
            {children}
          </ExpansionPanelDetails>
          {panelAction ? <ExpansionPanelActions>{panelAction}</ExpansionPanelActions> : null}
        </ExpansionPanel>
      </ThemeProvider>
    )
  }
}