/* eslint-disable react/jsx-key */
import * as React from 'react';
import { Component } from 'react';
import {Row,Col, Menu,Dropdown, Breadcrumb, Drawer, Button} from 'antd'
import Router from 'next/router';
import {UserOutlined,LoginOutlined,SettingOutlined, MenuUnfoldOutlined}from '@ant-design/icons'
import styles from '../styles/components/Header.module.css'
import LeftNav from './LeftNav';

export interface HeaderProps {
    title?:string,
    selectKey?:string,
    openKeys?:string[]
}
 
export interface HeaderState {
    isLogin:boolean,
    DrawerVisible:boolean,
    ShowDrawerButton:boolean
}
 
class Header extends React.Component<HeaderProps, HeaderState> {
    private breadcrumbtexts:string[]
    constructor(props: HeaderProps) {
        super(props);
        this.state = { isLogin: false,
        DrawerVisible:false,
        ShowDrawerButton:false
     };
    }
componentDidMount(){
   
    window.addEventListener('resize', this.handleResize.bind(this))
    if(document.body.clientWidth<770){
      this.setState({
        ShowDrawerButton:true
      })
    }
}
Logout = ()=>{
    localStorage.clear()
        Router.push('/Login')
}
componentWillUnmount() { 

    window.removeEventListener('resize', this.handleResize.bind(this))

  }
  handleResize = e => {
      if(e.target.innerWidth<770)
      {
        this.setState({
            ShowDrawerButton:true
        })
      }
      else
      {
        this.setState({
            ShowDrawerButton:false
        })
      }
}
menu = (<Menu>
    <Menu.Item onClick={this.Logout} icon={<LoginOutlined/>} >
    <a target="_blank" rel="noopener noreferrer" >
       登出
    </a>
    </Menu.Item>
</Menu>)
    render() { 
       
        return ( <div className={styles.header}>
             <Drawer
          title="菜单"
          placement='left'
          closable={false}
          onClose={()=>{
            this,this.setState({
              DrawerVisible:false
            })
          }}
          visible={this.state.DrawerVisible}
        >
          <div className={styles.drawer_content}>
          <LeftNav selectKey={this.props.selectKey} openKeys={this.props.openKeys}></LeftNav>
          </div>
        </Drawer>
        <Row  justify="space-between">
            <Col className={styles.header_left}  xs={15} sm={15} md={15} lg={15} xl={15}>
            {this.state.ShowDrawerButton&&<Button 
                    size='large'
                    onClick={()=>{
                        this.setState({
                            DrawerVisible:!this.state.DrawerVisible
                        })
                    }}
                    type='text'
                    icon={<MenuUnfoldOutlined />}></Button>}
                <div className={styles.header_logo}>
                    <span className={styles.big_word} style={{
                        color:'#f5cc7c'
                    }}>H</span>
                    <span className={styles.big_word} style={{
                        color:'#eb6a65'
                    }}>B</span>
                    <span className={styles.big_word} style={{
                        color:'#e2dcdc'
                    }}>U</span>
                    <span className={styles.big_word} style={{
                        color:'#6b99a8'
                    }}>T</span>
                    <span className={styles.small_word} style={{
                        color:'#f4574f'
                    }}>living</span>
                </div>
                <div className={styles.header_infromation} >
                    <span className={styles.header_text}>{this.props.title?this.props.title:"作业上传站"}</span>
                    {!this.state.ShowDrawerButton&&<span className={styles.header_bread}>
                        {this.breadcrumbtexts&&<Breadcrumb>
                            {this.breadcrumbtexts.map((item,index)=>(
                                <Breadcrumb.Item>{item}</Breadcrumb.Item>
                            ))}
                        </Breadcrumb>}
                    </span>}
                </div>
            </Col>
    
            <Col className={styles.menu} xs={7} sm={7} md={7} lg={7} xl={7}>
            <Dropdown overlay={this.menu} className={styles.dropdown}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                设置 <SettingOutlined />
                </a>
            </Dropdown>
            
            </Col>
        </Row>
     </div>  );
    }
}
 
export default Header;

