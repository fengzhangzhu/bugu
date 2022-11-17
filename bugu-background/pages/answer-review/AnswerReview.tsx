/* eslint-disable jsx-a11y/alt-text */
import { Button, Col, Image, Input, List, message, Modal, Pagination, Row, Spin } from 'antd';
import * as React from 'react';
import PageContent from '../../components/PageContent';
import { ImageFatherPath, REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
import styles from '../../styles/pages/AnswerReview.module.scss'
import { CommentSum, Fire, LikeSum, ViewsSum } from '../../components/MyIcons';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageInfo } from '../../utils/models';

interface AnswerItem {
    id:number
    userId:number
	questionId:number
	text:string	
	pic:string[]
	agreeSum:number
	opposeSum:number
	commentSum:number
	viewSum:number
	isAgreed:number
	isAnonymity:number
	isOpposed:number
	isVideo:number
    hot:number
	publishTime:string
}
interface AnswerReviewState {
    answers: AnswerItem[],
    listLoading: boolean,
    showDeleteModel: boolean,
    deleteItem?: AnswerItem,
    deleteIndex?: number,
    deleteReason?: string,
    pageNumber:number,
    answersTotal:number
}
class AnswerReview extends React.Component<any, AnswerReviewState> {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            listLoading: false,
            showDeleteModel: false,
            pageNumber:1,
            answersTotal:0
        };
    }
    componentDidMount() {
        this.getAnswerReview()
    }
    private async getAnswerReview(page:number=1) {
        this.setState({
            listLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.AnswerReview,
            data: {
                page,
            }
        }).then(async data => {
            this.setState({
                listLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                let pageInfo = data.data as PageInfo<AnswerItem>
                let answers = pageInfo.list
                let answersTotal = pageInfo.totalNum
                console.log('answers', answers)
                this.setState({
                    answers,
                    answersTotal
                })
            } else {
                message.error("获取失败")
            }
        })
    }
    private async deleteAnswer() {
        let answerItem: AnswerItem = this.state.deleteItem
        let index: number = this.state.deleteIndex
        let data = {
            id: answerItem.id,
            reason: `您于${answerItem.publishTime}发布的回答因 ${this.state.deleteReason} 已被删除`,
            userId: answerItem.userId
        }
        let path = servicePath.DeletAnswer+answerItem.id
        request({
            method: 'POST',
            url: path,
            data:data
        }).then(async data => {
            console.log(data)
            this.setState({
                showDeleteModel:false
            })
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success("删除成功")
                let answers = this.state.answers
                answers.splice(index, 1)
                console.log(answers)
                this.setState({
                    answers
                })
            } else {
                message.error("删除失败")
            }
        })
    }
    private async passAnswer(answerItem: AnswerItem, index: number) {
        request({
            method: 'POST',
            url: servicePath.PassAnswer+answerItem.id,
            data: {
                id: answerItem.id
            }
        }).then(async data => {
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success("通过成功")
                let answers = this.state.answers
                answers.splice(index, 1)
                await this.setState({
                    answers
                })
            } else {
                message.error("通过失败")
            }
        })
    }

    render() {
        return (
            <>
                <PageContent selectKey={'/answer-review/AnswerReview'} title='未审核回答'>

                    <Modal
                        title="你确定要删除这个回答吗？"
                        visible={this.state.showDeleteModel}
                        onOk={() => {
                            if (!this.state.deleteReason) {
                                message.error('请输入删除原因')
                            } else {
                                this.deleteAnswer()
                            }

                        }}

                        okText='确认'
                        cancelText='取消'
                        onCancel={() => {
                            this.setState({
                                showDeleteModel: false,
                                deleteReason: undefined,
                                deleteItem: undefined,
                                deleteIndex: undefined
                            })
                        }}
                    >

                        <Input
                            required
                            id="newFileName"
                            size="large"
                            placeholder='请输入原因'
                            value={this.state.deleteReason}
                            onChange={(e) => {
                                this.setState({
                                    deleteReason: e.target.value
                                })
                            }}
                        />

                    </Modal>
                    <div className={styles.answer_review_content} >
                    <Pagination defaultCurrent={1} current={this.state.pageNumber} onChange={(e) => {
                                    this.setState({
                                        pageNumber: e
                                    })
                                    this.getAnswerReview(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.answersTotal }

                                />
                        <Spin spinning={this.state.listLoading}>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.answers}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <div className={styles.list_item}>
                                            <Row className={styles.list_item_header} style={{
                                                width: '100%'
                                            }}>
                                                <Col span={18}>
                                                    <div className={styles.list_item_tltle}>{`${index + 1}. id:${item.id} 创建时间：${item.publishTime}`}</div>
                                                    <div className={styles.list_item_info}><Fire />{item.hot} <LikeSum />{item.agreeSum} <ViewsSum />{item.viewSum} <CommentSum />{item.commentSum}</div>
                                                </Col>
                                                <Col span={6}>
                                                    <Button onClick={() => {
                                                        this.passAnswer(item, index)
                                                    }} icon={<CheckOutlined />}>通过审核</Button>
                                                    <Button onClick={() => {
                                                        this.setState({
                                                            deleteIndex: index,
                                                            deleteItem: item,
                                                            showDeleteModel: true
                                                        })
                                                    }} icon={<DeleteOutlined />}>删除回答</Button>
                                                </Col>
                                            </Row>
                                            <div className={styles.list_item_text}>{item.text}</div>
                                            <div className={styles.list_item_image}>
                                                {
                                                    item.isVideo===1?
                                                    <>
                                                    {item.pic?.map((vido_item, index) => (
                                                            <video  width="320" height="240" controls key={vido_item}>
                                                                    <source src={vido_item} ></source>
                                                            </video>
                                                        ))}
                                                    </>:
                                                    <>
                                                    {item.pic?.map((item, index) => (
                                                    <Image
                                                        key={index}
                                                        width={100}
                                                        height={100}
                                                        src={item}
                                                    />
                                                ))}
                                                    </>
                                                }
                                            </div>
                                        </div>

                                    </List.Item>
                                )}
                            />
                        </Spin>
                        <Pagination defaultCurrent={1} current={this.state.pageNumber} onChange={(e) => {
                                    this.setState({
                                        pageNumber: e
                                    })
                                    this.getAnswerReview(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.answersTotal }

                                />
                    </div>
                </PageContent>
            </>
        );
    }
}

export default AnswerReview;