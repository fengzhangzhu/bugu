import { Input, List, Modal, Spin, Image, message, Button, Pagination, Tabs } from 'antd';
import * as React from 'react';
import { Component } from 'react';
import styles from '../../styles/pages/LabelReview.module.scss'
import PageContent from '../../components/PageContent';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import request, { servicePath } from '../../utils/request';
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
interface LabelReviewProps {

}
interface LabelItem {
    content: string
    id: number
}
interface LabelResult {
    list: LabelItem[],
    pageSum: number,
    total: number
}

interface LabelReviewState {
    showDeleteModel: boolean,
    showDeleteQuestionLabelModel:boolean,
    deleteItem?: LabelItem,
    deleteIndex?: number,
    isLoading: boolean,
    pageNumber: number,
    activityLabels: LabelItem[],
    activityLabelsTotal: number,
    questionLabels: LabelItem[],
    questionLabelsTotal: number,
    questionLabelPageNumber:number
}
const { TabPane } = Tabs;
class LabelReview extends React.Component<LabelReviewProps, LabelReviewState> {
    constructor(props: LabelReviewProps) {
        super(props);
        this.state = {
            showDeleteModel: false,
            isLoading: false,
            pageNumber: 1,
            activityLabels: [],
            activityLabelsTotal: 0,
            questionLabels:[],
            questionLabelsTotal:0,
            questionLabelPageNumber:1,
            showDeleteQuestionLabelModel:false
        };
    }
    componentDidMount() {
        this.getAcitivityLabelNotReview(1)
        this.getQuestionLabelNotReview(1)
    }
    //获取未审核的标签
    private async getAcitivityLabelNotReview(page: number) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.LabelReview,
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
                    activityLabels: data.data.list as LabelItem[],
                    activityLabelsTotal: data.data.total
                })
            } else {
                message.error("获取失败")
            }
        })
    }
    private async getQuestionLabelNotReview(page: number) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.QuestionLabelReview,
            data: {
                page,
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {

                this.setState({
                    questionLabels: data.data.list as LabelItem[],
                   questionLabelsTotal: data.data.totalSum
                })
            } else {
                message.error("获取失败")
            }
        })
    }
    //通过标签
    private async passActivityLabel(id: number, index: number) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'POST',
            url: servicePath.LabelAction + `${id}/pass`,
            data: {
                id: id
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                let activityLabels = this.state.activityLabels
                activityLabels.splice(index, 1)
                this.setState({
                    activityLabels
                })
                message.success('通过成功')
            } else {
                message.error("请求失败")
            }
        })
    }
    private async passQuestionLabel(id: number, index: number) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'POST',
            url: servicePath.PassQuestionLabel+ `${id}/pass`,
            data: {
                id: id
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                let questionLabels = this.state.questionLabels
                questionLabels.splice(index, 1)
                this.setState({
                    questionLabels
                })
                message.success('通过成功')
            } else {
                message.error("请求失败")
            }
        })
    }
    //删除标签
    private async deleteActivityLabel(id:number,index:number){
        this.setState({
            isLoading: true
        })
        request({
            method: 'DELETE',
            url: servicePath.LabelAction + `${id}/delete`,
            data: {
                id: id,
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                let activityLabels = this.state.activityLabels
                activityLabels.splice(index, 1)
                this.setState({
                    activityLabels
                })
                message.success('删除成功')
            } else {
                message.error("请求失败")
            }
        })
    }
    private async deleteQuestionLabel(id: number, index: number) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'DELETE',
            url: servicePath.DeletQuestionLabel+ `${id}/delete`,
            data: {
                label_id: id,
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                let  questionLabels= this.state.questionLabels
                questionLabels.splice(index, 1)
                this.setState({
                    questionLabels
                })
                message.success('删除成功')
            } else {
                message.error("请求失败")
            }
        })
    }
    render() {
        return (
            <PageContent selectKey='/label-review/labelReview' title='标签审核'>
                <div className={styles.label_review_content}>
                    <Modal
                        title="你确定要删除这个动态标签吗？"
                        visible={this.state.showDeleteModel}
                        onOk={() => {
                            this.deleteActivityLabel(this.state.deleteItem.id, this.state.deleteIndex)
                            this.setState({
                                showDeleteModel: false,
                                deleteItem: undefined,
                                deleteIndex: undefined
                            })
                        }}

                        okText='确认'
                        cancelText='取消'
                        onCancel={() => {
                            this.setState({
                                showDeleteModel: false,
                                deleteItem: undefined,
                                deleteIndex: undefined
                            })
                        }}
                    >

                    </Modal>
                    <Modal
                        title="你确定要删除这个问题标签吗？"
                        visible={this.state.showDeleteQuestionLabelModel}
                        onOk={() => {
                            this.deleteQuestionLabel(this.state.deleteItem.id, this.state.deleteIndex)
                            this.setState({
                                showDeleteQuestionLabelModel: false,
                                deleteItem: undefined,
                                deleteIndex: undefined
                            })
                        }}

                        okText='确认'
                        cancelText='取消'
                        
                        onCancel={() => {
                            this.setState({
                                showDeleteQuestionLabelModel: false,
                                deleteItem: undefined,
                                deleteIndex: undefined
                            })
                        }}
                    >

                    </Modal>
                    <Tabs defaultActiveKey='1' centered>
                        <TabPane tab="动态标签" key="1">
                            <Spin spinning={this.state.isLoading}>
                                <List
                                    dataSource={this.state.activityLabels}
                                    renderItem={(item, index) => (<List.Item
                                        key={index}

                                    >
                                        <List.Item.Meta
                                            title={<div style={{
                                                display: 'flex'
                                            }}><h3
                                                style={{
                                                    minWidth: '100px',
                                                    marginLeft: '20px'
                                                }}
                                            >{index + 1}.<a >id:{item.id} </a></h3>
                                                <div
                                                    style={{
                                                        minWidth: '200px',
                                                        marginLeft: '50px'
                                                    }}
                                                >{'标签内容：' + item.content}</div>
                                                <Button className={styles.label_review_button} size='small' onClick={() => {
                                                    this.passActivityLabel(item.id, index)
                                                }} icon={<CheckOutlined />}>通过审核</Button>
                                                <Button className={styles.label_review_button} size='small' onClick={() => {
                                                    this.setState({
                                                        showDeleteModel: true,
                                                        deleteItem: item,
                                                        deleteIndex: index
                                                    })

                                                }} icon={<DeleteOutlined />}>删除标签</Button>

                                            </div>}

                                        />

                                    </List.Item>)}
                                >


                                </List>
                                <Pagination current={this.state.pageNumber} total={this.state.activityLabelsTotal} onChange={(e) => {
                                    this.getAcitivityLabelNotReview(e)
                                    this.setState({
                                        pageNumber: e
                                    })
                                }} />
                            </Spin>
                        </TabPane>
                        <TabPane tab="问题标签" key="2">
                            <Spin spinning={this.state.isLoading}>
                                <List
                                    dataSource={this.state.questionLabels}
                                    renderItem={(item, index) => (<List.Item
                                        key={index}

                                    >
                                        <List.Item.Meta
                                            title={<div style={{
                                                display: 'flex'
                                            }}><h3
                                                style={{
                                                    minWidth: '100px',
                                                    marginLeft: '20px'
                                                }}
                                            >{index + 1}.<a >id:{item.id} </a></h3>
                                                <div
                                                    style={{
                                                        minWidth: '200px',
                                                        marginLeft: '50px'
                                                    }}
                                                >{'标签内容：' + item.content}</div>
                                                <Button className={styles.label_review_button} size='small' onClick={() => {
                                                    this.passQuestionLabel(item.id, index)
                                                }} icon={<CheckOutlined />}>通过审核</Button>
                                                <Button className={styles.label_review_button} size='small' onClick={() => {
                                                    this.setState({
                                                        showDeleteQuestionLabelModel: true,
                                                        deleteItem: item,
                                                        deleteIndex: index
                                                    })

                                                }} icon={<DeleteOutlined />}>删除标签</Button>

                                            </div>}

                                        />

                                    </List.Item>)}
                                >
                                </List>
                                <Pagination current={this.state.questionLabelPageNumber} total={this.state.questionLabelsTotal} onChange={(e) => {
                                    this.getQuestionLabelNotReview(e)
                                    this.setState({
                                        questionLabelPageNumber: e
                                    })
                                }} />
                            </Spin>
                        </TabPane>
                    </Tabs>

                </div>
            </PageContent>
        );
    }
}

export default LabelReview;