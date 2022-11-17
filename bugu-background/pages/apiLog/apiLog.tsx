import { FolderOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, List, message, Pagination, Row, Tabs } from 'antd';
import Router from 'next/dist/client/router';
import * as React from 'react';
import { Component } from 'react';
import { isTemplateMiddle } from 'typescript';
import PageContent from '../../components/PageContent';
import styles from '../../styles/pages/apiLog.module.scss'
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
interface ApiLogProps {

}
interface LogItem {
    createTime: string
    id: number
    path: string
    request: string
    result: string
    taskId: string
    time: number
}
interface ApiGroupItem {
    path: string,
    sum: number
}

interface ApiLogState {
    apigroups?: ApiGroupItem[],
    apiPath?:string,
    apiPageNumber:number,
    apiLogList?:LogItem[],
    apiLogListTotal?:number,
    showLogList?:boolean,
    apiErrorGroups?: ApiGroupItem[],
    apiErrorPath?:string,
    apiErrorPageNumber:number,
    apiErrorLogList?:LogItem[],
    apiErrorLogListTotal?:number,
    showErrorLogList:boolean,
}
const { TabPane } = Tabs;
//  穆兰 2021年10月15日 获取api日志分组以及分组查看
class ApiLog extends React.Component<ApiLogProps, ApiLogState> {
    constructor(props: ApiLogProps) {
        super(props);
        this.state = {
            showLogList:false,
            showErrorLogList:false,
            apiPageNumber:1,
            apiErrorPageNumber:1
        };
    }


    componentDidMount() {
        this.getLogGroup()
        this.getErrorLogGroup()
    }
    private async getLogGroup() {
        request({
            method: 'GET',
            url: servicePath.ApiLogGroup,
            data: {

            }
        }).then(async data => {
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    apigroups: data.data as ApiGroupItem[]
                })
                console.log(data)
            } else {
                message.error(data.errMsg)
            }
        })
    }
    private async getLogList(page:number=1,path:string=this.state.apiPath) {
        console.log(page)
        console.log(path)
        request({
            method: 'GET',
            url: servicePath.ApiLogGroupList,
            data: {
                page: page,
                path:path
            }
        }).then(async data => {
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    apiLogList:data.data.list,
                    apiLogListTotal:data.data.total
                })
                console.log(data)
            } else {
                message.error(data.errMsg)
            }
        })
    }
    private async getErrorLogGroup() {
        request({
            method: 'GET',
            url: servicePath.ApiErrorLogGroup,
            data: {

            }
        }).then(async data => {
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    apiErrorGroups: data.data as ApiGroupItem[],
                    
                })

            } else {
                message.error(data.errMsg)
            }

        })
    }
    private async getErrorLogList(page:number=1,path:string=this.state.apiErrorPath) {
        request({
            method: 'GET',
            url: servicePath.ApiErrorLogGroupList,
            data: {
                page: page,
                path:path
            }
        }).then(async data => {
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    apiErrorLogList:data.data.list,
                    apiErrorLogListTotal:data.data.total
                })
            } else {
                message.error(data.errMsg)
            }
        })
    }
    render() {
        return (<PageContent selectKey='/apiLog/apiLog' title='api调用日志'>
            <div className={styles.api_log_content}>
                <Tabs defaultActiveKey='1' centered>
                    <TabPane tab="api日志分组" key="1">
                        <div>
                           {this.state.showLogList?<div className={styles.log_list_content}>
                               <Button onClick={()=>{
                                   this.setState({
                                       showLogList:false
                                   })
                               }}>返回分组页面</Button> <span style={{
                                marginLeft:'20px'
                            }}>当前分组：{this.state.apiPath}</span>
                                <Pagination className={styles.pogination_top} defaultCurrent={1} current={this.state.apiPageNumber} onChange={(e) => {
                                    this.setState({
                                        apiPageNumber: e
                                    })
                                    this.getLogList(e,this.state.apiPath)
                                }} showSizeChanger={false} pageSize={15} total={this.state.apiLogListTotal ? this.state.apiLogListTotal : 100} />
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.apiLogList}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <div className={styles.log_list_item_content}>
                                                <div><h3>{index + 1}.<a >id: {item.id} taskId: {item.taskId} 创建时间：{item.createTime} time: {item.time}</a></h3></div>
                                                <div><h3>path: </h3>{item.path}</div>
                                                <div><h3>request: </h3>{item.request}</div>
                                                <div><h3>result: </h3>{item.result}</div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                                <Pagination defaultCurrent={1} current={this.state.apiPageNumber} onChange={(e) => {
                                    this.setState({
                                        apiPageNumber: e
                                    })
                                    this.getLogList(e,this.state.apiPath)
                                }} showSizeChanger={false} pageSize={15} total={this.state.apiLogListTotal ? this.state.apiLogListTotal : 100}

                                />
                            </div>:<List
                                itemLayout="horizontal"
                                dataSource={this.state.apigroups}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<FolderOutlined style={{
                                                fontSize: '30px',
                                                color: '#3d7cce'
                                            }} />}
                                            title={<a onClick={() => {
                                               this.setState({
                                                   apiPath:item.path,
                                                   showLogList:true
                                               })
                                               this.getLogList(1,item.path)
                                            }} >{item.path}</a>}
                                            description={'日志总数:' + item.sum} />
                                    </List.Item>
                                )}
                            />} 
                        </div>
                    </TabPane>
                    <TabPane tab="api错误日志分组" key="2">
                        <div>
                           {this.state.showErrorLogList?<div className={styles.log_list_content}>
                           <Button onClick={()=>{
                                   this.setState({
                                       showErrorLogList:false
                                   })
                               }}>返回分组页面</Button><span style={{
                                   marginLeft:'20px'
                               }}> 当前分组：{this.state.apiErrorPath}</span>
                                <Pagination className={styles.pogination_top} defaultCurrent={1} current={this.state.apiErrorPageNumber} onChange={(e) => {
                                    this.setState({
                                        apiErrorPageNumber: e
                                    })
                                    this.getErrorLogList(e,this.state.apiErrorPath)
                                }} showSizeChanger={false} pageSize={15} total={this.state.apiErrorLogListTotal ? this.state.apiErrorLogListTotal : 50} />
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.apiErrorLogList}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            <div className={styles.log_list_item_content}>
                                                <div><h3>{index + 1}.<a >id: {item.id} taskId: {item.taskId} 创建时间：{item.createTime} time: {item.time}</a></h3></div>
                                                <div><h3>path: </h3>{item.path}</div>
                                                <div><h3>request: </h3>{item.request}</div>
                                                <div><h3>result: </h3>{item.result}</div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                                <Pagination defaultCurrent={1} current={this.state.apiErrorPageNumber} onChange={(e) => {
                                    this.setState({
                                        apiErrorPageNumber: e
                                    })
                                    this.getErrorLogList(e,this.state.apiErrorPath)
                                }} showSizeChanger={false} pageSize={15} total={this.state.apiErrorLogListTotal ? this.state.apiErrorLogListTotal : 50}

                                />
                            </div>:<List
                                itemLayout="horizontal"
                                dataSource={this.state.apiErrorGroups}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<FolderOutlined style={{
                                                fontSize: '30px',
                                                color: '#3d7cce'
                                            }} />}
                                            title={<a onClick={() => {
                                                this.setState({
                                                    showErrorLogList:true,
                                                    apiErrorPath:item.path
                                                })
                                                this.getErrorLogList(1,item.path)
                                            }} >{item.path}</a>}
                                            description={'日志总数:' + item.sum} />
                                    </List.Item>
                                )}
                            />} 
                        </div>
                    </TabPane>

                </Tabs>
            </div>
        </PageContent>);
    }
}

export default ApiLog;