import React from 'react'
import axios from 'axios'
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { t,Trans } from "@lingui/macro";
import { message, Alert} from 'antd';
import { SubTitle } from '../layout/sub-title'
import { cssNames } from "../../utils";
import { systemName } from "../input/input.validators";
import { configStore } from "../../config.store";
import { themeStore } from "../../theme.store";
import { Notifications } from "../notifications";
import { withRouter, RouteComponentProps } from 'react-router';
import { crdStore } from '../+custom-resources'
import { _i18n } from "../../i18n";
import { Input } from '../input'
import { Button } from '../button'
import './login.scss'
interface Props extends RouteComponentProps {
  history: any
}
@observer
class LoginComponet extends React.Component<Props>{

  @observable username = ''
  @observable password = ''
  @observable loading = false

  onKeyDown = (e:React.KeyboardEvent) => {
    if(e.keyCode === 13) {
      this.onFinish()
    }
  }

  onFinish = () => {
    if(!this.username || !this.password){
      Notifications.error('Please enter account or password')
      return
    }
    this.loading = true
    axios.post('/user-login', {username:this.username,password:this.password})
      .then((res: any) => {
        configStore.isLoaded = true
        configStore.setConfig(res.data)
        window.localStorage.setItem('u_config',JSON.stringify(res.data))
        crdStore.loadAll()
        Notifications.ok('Login Success')
        const hide = message.loading('Loading..', 1500);
        setTimeout(hide, 1500);
        this.loading = true
        setTimeout(() => {
          if (res.data.isClusterAdmin === true) {
            this.props.history.push('/cluster')
          }else{
            this.props.history.push('/workloads')
          }
          this.loading = false
        }, 500)
      }).catch(err => {
        if(err && err.response){
          Notifications.error(err.response.data)
        }
        this.loading = false
      })
  };

  render() {
    return (
      <div className={cssNames("login-main", themeStore.activeTheme.type)}>
        <div className="login-header">
          <div className="login-title">
            <img src={require("../../favicon/compass.png")} />
            <div className="text">Compass</div>
          </div>
          <div className="login-sub-title">Compass Cloud Platform</div>

        </div>
        <div className="login-content">
          <div>
              <SubTitle title={<Trans>Username</Trans>}/>
              <Input
                maxLength={30}
                placeholder={_i18n._(t`Input your username`)}
                value={this.username}
                iconLeft="person"
                validators={systemName}
                onChange={v => this.username = v}
              />
              <SubTitle title={<Trans>Password</Trans>}/>
              <Input
                maxLength={30}
                placeholder={_i18n._(t`Input your password`)}
                value={this.password}
                iconLeft="lock"
                validators={systemName}
                onChange={v => this.password = v}
                onKeyDown={e=>this.onKeyDown(e)}
                type="password"
              />
              <Button className="login-btn-submit" primary waiting={this.loading} onClick={this.onFinish} >
                Submit
              </Button>
            </div>

        </div>
        <div className="footer">
          <Alert message="Only supports Chrome browser" showIcon type="warning" closable style={{ marginTop: '50px' }} />
        </div>
      </div>
    );
  }
}

export const Login = withRouter(LoginComponet);