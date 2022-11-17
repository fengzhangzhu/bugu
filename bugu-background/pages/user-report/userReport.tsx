import { CheckOutlined, ClearOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, List, Modal, Spin, Image, Button, Pagination, message, Cascader, DatePicker, Form, InputNumber, Radio, Select, Switch, TreeSelect } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import * as React from 'react';

import PageContent from '../../components/PageContent';
import styles from '../../styles/pages/userReport.module.scss'
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';

interface UserReportProps {

}
interface ReportItem {
    createTime: string,
    id: number,
    informerId: number
    objectId: number
    objectType: string
    reason: string
    objectUserId: number

}

interface UserReportState {
    isLoading: boolean
    reports: ReportItem[]
    showPunishModel: boolean
    pageNumber: number
    total: number
    punishItem?: ReportItem
    punishIndex?: number
    punishReason?: string
    punishtype?: string
    punishDays?: number
}

class UserReport extends React.Component<UserReportProps, UserReportState> {
    constructor(props: UserReportProps) {
        super(props);
        this.state = {
            isLoading: false,
            reports: [],
            showPunishModel: false,
            pageNumber: 1,
            total: 0
        };
    }
    componentDidMount() {
        this.getUserReportList(1)
    }


    //获取用户举报列表
    private async getUserReportList(page: number) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.UserReportList,
            data: {
                page: page
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    reports: data.data.list as ReportItem[],
                    total: data.data.total
                })
            } else {
                message.error("获取失败")
            }
        })
    }
    /**
     * @function 惩罚用户
     * @param days 处罚天数
     * @param reason 原因,包括处罚类型和处罚时长
     * @param type 处罚类型 1禁言 2封号
     * @param userId 处罚用户id
     * @param informerId 举报者id,在用户举报列表处罚用户时加上这个参数,如果存在此参数,系统会给举报者发送举报成功的官方消息
     */
     private async punishUser(days:number,reason:string,type:string,userId:number,informerId:number) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'POST',
            url: servicePath.PunishUser,
            data: {
                days:days,
                reason:reason,
                type:type,
                userId:userId,
                informerId:informerId
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
               let reports = this.state.reports
               reports.splice(this.state.punishIndex,1)
               this.setState({
                   reports
               })
               message.success("处理成功")
            } else {
                message.error("处理失败")
            }
        })
    }

    render() {
        return (
            <PageContent selectKey='/user-report/userReport' title='用户举报'>
                <div className={styles.report_review_content}>
                    <Modal
                        title="消息详情"
                        visible={this.state.showPunishModel}
                        onOk={() => {
                            if(!this.state.punishReason){
                                message.error('请输入原因')
                                return
                            }
                            if(!this.state.punishtype){
                                message.error('请选择类型')
                                return
                            }
                            if(!this.state.punishDays){
                                message.error('输入惩罚天数')
                                return
                            }
                            console.log(this.state.punishtype)
                            this.punishUser(this.state.punishDays,this.state.punishReason,
                                this.state.punishtype,this.state.punishItem.objectUserId,this.state.punishItem.informerId)
                            this.setState({
                                showPunishModel: false,
                            })
                        
                        }}

                        okText='确认'
                        cancelText='取消'
                        onCancel={() => {
                            
                            this.setState({
                                showPunishModel: false,
                            })
                        }}
                    >
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                            layout="horizontal"
                        >
                            <Form.Item label="原因">
                                <Input value={this.state.punishReason}
                                    onChange={(e) => {
                                        this.setState({
                                            punishReason: e.target.value
                                        })
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="惩罚类型">
                                <Select
                                    value={this.state.punishtype}
                                    onChange={(e) => {
                                        this.setState({
                                            punishtype: e
                                        })
                                    }}
                                >
                                    <Select.Option value="mute">禁言</Select.Option>
                                    <Select.Option value="banAccount">封号</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="天数">
                                <InputNumber value={this.state.punishDays}
                                    onChange={(e) => {
                                        this.setState({
                                            punishDays: e
                                        })
                                    }}
                                />
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Spin spinning={this.state.isLoading}>
                        <List
                            dataSource={this.state.reports}
                            renderItem={(item, index) => (<List.Item
                                key={index}
                            >
                                <List.Item.Meta
                                    title={<div style={{
                                        display: 'flex'
                                    }}><h3>{index + 1}.<a >id:{item.id} userId:{item.objectUserId} objectId:{item.objectId} objectType:{item.objectType} 举报时间：{item.createTime}</a></h3>
                                        <Button className={styles.report_review_button} size='small' onClick={() => {
                                            this.setState({
                                                showPunishModel: true,
                                                punishItem: item,
                                                punishIndex: index
                                            })
                                        }} icon={<ClearOutlined />}>进行处罚</Button>
                                        {/* <Button className={styles.report_review_button} size='small' onClick={() => {



                                        }} icon={<DeleteOutlined />}>取消并删除</Button> */}
                                    </div>}
                                    description={`举报原因：${item.reason}`}
                                />

                            </List.Item>)}
                        >
                        </List>
                        <Pagination current={this.state.pageNumber} total={this.state.total} onChange={(e) => {
                            this.getUserReportList(e)
                            this.setState({
                                pageNumber: e
                            })
                        }} />
                    </Spin>
                </div>
            </PageContent>

        );
    }
}

export default UserReport;