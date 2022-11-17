
import * as React from 'react';
import { Component } from 'react';
import Head from 'next/head'
import {Row,Col,Menu, Button, Drawer} from 'antd'
import LeftNav from './LeftNav'
import Header from './Header'


interface PageContentProps{
    title?:string,
    selectKey?:string,
    openKeys?:string[],
    
} 
interface PageContentState{
  isPhone:boolean
}
class PageContent extends Component<PageContentProps,PageContentState> {
  constructor(props) {
    super(props);
    this.state = { 
      isPhone:false
     }
  }
  componentDidMount(){
    if(document.body.clientWidth<770){
      this.setState({
        isPhone:true
      })
    }
  }
  render() { 
    return (
      <>
      <div className='container'>
        <Head>
          <title>{this.props.title?this.props.title:'HBUT作业上传站'}</title>
          <meta name="description" content={this.props.title?this.props.title:'HBUT作业上传站'} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no"></meta>
          <link rel="icon" href="/image/logo.png" />
        </Head>
      </div>
      <Header selectKey={this.props.selectKey} title={this.props.title}></Header>
     
      <Row className="comm-main"  justify="center" gutter={[8,0]}>
        <Col className="comm-left"  xs={0} sm={0} md={4} lg={4} xl={4}>
        <div className='col-content'>
        <LeftNav selectKey={this.props.selectKey} openKeys={this.props.openKeys}></LeftNav>
        </div>
        </Col>
        <Col className="comm-right"  xs={24} sm={24} md={20} lg={20} xl={20} >  
          <div className={this.state.isPhone?'col-content-80vh':'col-content'}>
        {this.props.children}
          </div>         
        </Col>
      </Row>
      
      </> );
  }
}
 
export default  PageContent;

