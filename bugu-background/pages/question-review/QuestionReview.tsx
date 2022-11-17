/* eslint-disable jsx-a11y/alt-text */
import { Button, Col, Image, Input, List, message, Modal, Pagination, Row, Spin } from 'antd';
import * as React from 'react';
import PageContent from '../../components/PageContent';
import { ImageFatherPath, REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
import styles from '../../styles/pages/QuestionReview.module.scss'
import { CommentSum, Fire, LikeSum, ViewsSum } from '../../components/MyIcons';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageInfo } from '../../utils/models';

interface QuestionItem {
    id:number
    userId:number
    title:string
    text:string
    video:string[]
    isAnonymity:number			
    isCollected:number		
    isLiked	:number	
    likeSum:number
    answerSum:number
    collectSum:number
    viewSum:number
    hot:number
    pics:string[]
    publishTime:string
}
interface QuestionReviewState {
    questions: QuestionItem[],
    listLoading: boolean,
    showDeleteModel: boolean,
    deleteItem?: QuestionItem,
    deleteIndex?: number,
    deleteReason?: string,
    pageNumber:number,
    questionsTotal:number
}
class QuestionReview extends React.Component<any, QuestionReviewState> {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            listLoading: false,
            showDeleteModel: false,
            pageNumber:1,
            questionsTotal:0
        };
    }
    componentDidMount() {
        this.getQuestionReview()
    }
    private async getQuestionReview(page:number=1) {
        this.setState({
            listLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.QuestionReview,
            data: {
                page,
            }
        }).then(async data => {
            this.setState({
                listLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                const pageInfo =  data.data as PageInfo<QuestionItem>
                let questions = pageInfo.list
                let questionsTotal = pageInfo.totalNum as number
                console.log('questions', questions)
                this.setState({
                    questions,
                    questionsTotal
                })
            } else {
                message.error("获取失败")
            }
        })
    }
    private async deleteQuestion() {
        let questionItem: QuestionItem = this.state.deleteItem
        let index: number = this.state.deleteIndex
        let data = {
            id: questionItem.id,
            reason: `您于${questionItem.publishTime}发布的问题因 ${this.state.deleteReason} 已被删除`,
            userId: questionItem.userId
        }
        let path = servicePath.DeletQuestion+questionItem.id
        console.log(path)
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
                let questions = this.state.questions
                questions.splice(index, 1)
                console.log(questions)
                this.setState({
                    questions
                })
            } else {
                message.error("删除失败")
            }
        })
    }
    private async passQuestion(questionItem: QuestionItem, index: number) {
        request({
            method: 'POST',
            url: servicePath.PassQuestion + questionItem.id,
            data: {
                id: questionItem.id
            }
        }).then(async data => {
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success("通过成功")
                let questions = this.state.questions
                questions.splice(index, 1)
                await this.setState({
                    questions
                })
            } else {
                message.error("通过失败")
            }
        })
    }

    render() {
        return (
            <>
                <PageContent selectKey={'/question-review/QuestionReview'} title='未审核问题'>

                    <Modal
                        title="你确定要删除这个问题吗？"
                        visible={this.state.showDeleteModel}
                        onOk={() => {
                            if (!this.state.deleteReason) {
                                message.error('请输入删除原因')
                            } else {
                                this.deleteQuestion()
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
                    <div className={styles.article_review_content} >
                    <Pagination defaultCurrent={1} current={this.state.pageNumber} onChange={(e) => {
                                    this.setState({
                                        pageNumber: e
                                    })
                                    this.getQuestionReview(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.questionsTotal }

                                />
                        <Spin spinning={this.state.listLoading}>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.questions}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <div className={styles.list_item}>
                                            <Row className={styles.list_item_header} style={{
                                                width: '100%'
                                            }}>
                                                <Col span={18}>
                                                    <div className={styles.list_item_tltle}>{`${index + 1}. id:${item.id} 创建时间：${item.publishTime}`}</div>
                                                    <div className={styles.list_item_info}><Fire />{item.hot} <LikeSum />{item.likeSum} <ViewsSum />{item.viewSum} <CommentSum />{item.answerSum}</div>
                                                </Col>
                                                <Col span={6}>
                                                    <Button onClick={() => {
                                                        this.passQuestion(item, index)
                                                    }} icon={<CheckOutlined />}>通过审核</Button>
                                                    <Button onClick={() => {
                                                        this.setState({
                                                            deleteIndex: index,
                                                            deleteItem: item,
                                                            showDeleteModel: true
                                                        })
                                                    }} icon={<DeleteOutlined />}>删除问题</Button>
                                                </Col>
                                            </Row>
                                            <h3 >{item.title}</h3>
                                            <div className={styles.list_item_text}>{item.text}</div>
                                            <div className={styles.list_item_image}>
                                               
                                                {item.video?.map((vido_item, index) => (
                                                            <video  width="320" height="240" controls key={vido_item}>
                                                                    <source src={vido_item} ></source>
                                                            </video>
                                                        ))}
                                                
                                                 {item.pics?.map((item, index) => (
                                                    <Image
                                                        key={index}
                                                        width={100}
                                                        height={100}
                                                        src={item}
                                                    />
                                                ))}
                                                
                                               
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
                                    this.getQuestionReview(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.questionsTotal }

                                />
                    </div>
                </PageContent>
            </>
        );
    }
}

export default QuestionReview;