import React , {useState,useEffect,createContext} from 'react';
import styles from '../styles/pages/Login.module.css';
import { Card, Input,Button ,Spin,message, Collapse, Row, Col  } from 'antd';
import Router from 'next/router'
import request,{servicePath} from '../utils/request';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Head from 'next/head';
import aes  from "../utils/aes/export";
import { REQUEST_SUCCEEDED_CODE } from '../utils/constants';
React.useLayoutEffect = useEffect;
function Login(props){
    const [userName , setUserName] = useState('')
    const [password , setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const checkLogin = ()=>{

        setIsLoading(true)
        if(!userName){
            setIsLoading(false)
            message.error('用户名不能为空')
            return false
        }else if(!password){
            setIsLoading(false)
            message.error('密码不能为空')
            return false
        }
        let dataProps = {
            username:userName,
            password:password
        }
        request({
            method:'GET',
            url:servicePath.Login,
            data:dataProps,
        }).then(data=>{
            setIsLoading(false)
            if(data.code==REQUEST_SUCCEEDED_CODE){
                localStorage.setItem('hbutback-token',data.data)
                Router.push('/index')
            }else{
                message.error('用户名密码错误')
            }
        })
        setTimeout(()=>{
            setIsLoading(false)
        },1000)
    }
    return (
        <div className={styles.login_content}>
            <div className={styles.container}>
        <Head>
          <title>管理员登录</title>
          <meta name="description" content={'HBUT作业上传站'} />
          <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no"></meta>
          <link rel="icon" href="/image/logo.png" />
        </Head>
      </div>
        <Row  justify='center'>
        <Col  xs={22} sm={16} md={12} lg={8} xl={6}>  
        <div className={styles.login_div}>
            <Spin tip="Loading..." spinning={isLoading}>
                <Card title="登录" bordered={true} style={{ width: '100%'}} >
                    <Input
                        id="userName"
                        size="large"
                        placeholder="请输入用户名"
                        prefix={<UserOutlined />} 
                        onChange={(e)=>{setUserName(e.target.value)}}
                    /> 
                    <br/><br/>
                    <Input.Password
                        id="password"
                        size="large"
                        placeholder="请输入密码"
                        prefix={<LockOutlined />}
                        onChange={(e)=>{setPassword(e.target.value)}}
                    />     
                    <br/><br/>
                    <Button type="primary" size="large" block onClick={checkLogin} > 登录 </Button>
                </Card>
            </Spin>
        </div>
        </Col>
        </Row>
        </div>
    )
}
export default Login;
