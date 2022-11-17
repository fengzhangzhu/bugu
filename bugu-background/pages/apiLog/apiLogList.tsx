import { FolderOutlined } from '@ant-design/icons';
import { Badge, Card, Col, List, message, Pagination, Row, Tabs } from 'antd';
import * as React from 'react';
import { Component } from 'react';
import PageContent from '../../components/PageContent';
import styles from '../../styles/pages/apiLog.module.scss'
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
interface ApiLogListProps {

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
interface ApiLogListState {
    tagSelect: string,
    logList?: LogItem[],
    errorLogList?: LogItem[],
    thisLogPage: number,
    thisErrorLogPage: number,
    logTotal?: number,
    errorLogTotal?: number
}
//  穆兰 2021年10月16日 获取api日志列表
const { TabPane } = Tabs;
const API_CALL_LOG = 'api调用日志'
const API_ERROR_LOG = 'api错误日志'
class ApiLogList extends React.Component<ApiLogListProps, ApiLogListState> {
    constructor(props: ApiLogListProps) {
        super(props);
        this.state = {
            tagSelect: API_CALL_LOG,
            thisLogPage: 1,
            thisErrorLogPage: 1
        };
    }
    componentDidMount() {
        this.getLogList()
        this.getErrorLogList()
    }

    private async getLogList(page: number = 1) {
        request({
            method: 'GET',
            url: servicePath.ApiLogList,
            data: {
                page: page
            }
        }).then(async data => {
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    logList: data.data.list as LogItem[],
                    logTotal: data.data.total
                })
                console.log(data.data)
            } else {
                message.error(data.errMsg)
            }
        })
    }
    private async getErrorLogList(page: number = 1) {
        request({
            method: 'GET',
            url: servicePath.ApiErrorLogList,
            data: {
                page: page
            }
        }).then(async data => {
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    errorLogList: data.data.list as LogItem[],
                    errorLogTotal: data.data.total
                })
                console.log(data)
            } else {
                message.error(data.errMsg)
            }
        })
    }
    render() {
        return (
            <PageContent selectKey='/apiLog/apiLogList' title='api日志列表'>
                <div className={styles.api_log_content}>
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab={`api日志列表（${this.state.logTotal}）`} key="1">
                            <div className={styles.log_list_content}>
                                <Pagination className={styles.pogination_top} defaultCurrent={1} current={this.state.thisLogPage} onChange={(e) => {
                                    this.setState({
                                        thisLogPage: e
                                    })

                                    this.getLogList(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.logTotal ? this.state.logTotal : 100} />
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.logList}
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
                                <Pagination defaultCurrent={1} current={this.state.thisLogPage} onChange={(e) => {
                                    this.setState({
                                        thisLogPage: e
                                    })
                                    this.getLogList(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.logTotal ? this.state.logTotal : 100}

                                />
                            </div>
                        </TabPane>
                        <TabPane tab={`api错误日志列表（${this.state.errorLogTotal}）`} key="2">
                            <div className={styles.log_list_content}>
                                <Pagination className={styles.pogination_top} defaultCurrent={1} current={this.state.thisErrorLogPage} onChange={(e) => {
                                    this.setState({
                                        thisErrorLogPage: e
                                    })

                                    this.getErrorLogList(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.errorLogTotal ? this.state.errorLogTotal : 50} />
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.errorLogList}
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
                                <Pagination defaultCurrent={1} current={this.state.thisErrorLogPage} onChange={(e) => {
                                    this.setState({
                                        thisErrorLogPage: e
                                    })
                                    this.getErrorLogList(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.errorLogTotal ? this.state.errorLogTotal : 50}

                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </PageContent>
        );
    }
}

export default ApiLogList;