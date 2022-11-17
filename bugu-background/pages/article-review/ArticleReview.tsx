/* eslint-disable jsx-a11y/alt-text */
import { Button, Col, Image, Input, List, message, Modal, Pagination, Row, Spin } from 'antd';
import * as React from 'react';
import PageContent from '../../components/PageContent';
import { ImageFatherPath, REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
import styles from '../../styles/pages/ArticleReview.module.scss'
import { CommentSum, Fire, LikeSum, ViewsSum } from '../../components/MyIcons';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';

interface ArticleItem {
    commentSum: number
    createTime: string
    hot: number
    id: number
    isDelete: number
    likeSum: number
    pic: string[]
    text: string
    updateTime: string
    userId: number
    viewSum: number

}
interface ArticleReviewState {
    articles: ArticleItem[],
    listLoading: boolean,
    showDeleteModel: boolean,
    deleteItem?: ArticleItem,
    deleteIndex?: number,
    deleteReason?: string,
    pageNumber:number,
    articlesTotal:number
}
class ArticleReview extends React.Component<any, ArticleReviewState> {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            listLoading: false,
            showDeleteModel: false,
            pageNumber:1,
            articlesTotal:0
        };
    }
    componentDidMount() {
        this.getArticleReview()
    }
    private async getArticleReview(page:number=1) {
        this.setState({
            listLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.ArticleReview,
            data: {
                page:page
            }
        }).then(async data => {
            this.setState({
                listLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                let articles = data.data.list as ArticleItem[]
                let articlesTotal = data.data.total as number
                console.log('articles', articles)
                this.setState({
                    articles,
                    articlesTotal
                })
            } else {
                message.error("获取失败")
            }
        })
    }
    private async deleteArticle() {
        let articleItem: ArticleItem = this.state.deleteItem
        let index: number = this.state.deleteIndex
        let data = {
            id: articleItem.id,
                reason: `您于${articleItem.createTime}发布的动态因 ${this.state.deleteReason} 已被删除`,
                userId: articleItem.userId
        }
        let path = servicePath.DeleteArticle + articleItem.id
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
                let articles = this.state.articles
                articles.splice(index, 1)
                console.log(articles)
                this.setState({
                    articles
                })
            } else {
                message.error("删除失败")
            }
        })
    }
    private async passArticle(articleItem: ArticleItem, index: number) {
        request({
            method: 'POST',
            url: servicePath.PassArticle + articleItem.id,
            data: {
                id: articleItem.id
            }
        }).then(async data => {
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success("通过成功")
                let articles = this.state.articles
                articles.splice(index, 1)
                await this.setState({
                    articles
                })
            } else {
                message.error("通过失败")
            }
        })
    }

    render() {
        return (
            <>
                <PageContent selectKey={'/article-review/ArticleReview'} title='未审核动态'>

                    <Modal
                        title="你确定要删除这个动态吗？"
                        visible={this.state.showDeleteModel}
                        onOk={() => {
                            if (!this.state.deleteReason) {
                                message.error('请输入删除原因')
                            } else {
                                this.deleteArticle()
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
                                    this.getArticleReview(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.articlesTotal }

                                />
                        <Spin spinning={this.state.listLoading}>
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.articles}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <div className={styles.list_item}>
                                            <Row className={styles.list_item_header} style={{
                                                width: '100%'
                                            }}>
                                                <Col span={18}>
                                                    <div className={styles.list_item_tltle}>{`${index + 1}. id:${item.id} 创建时间：${item.createTime} 更新时间：${item.updateTime}`}</div>
                                                    <div className={styles.list_item_info}><Fire />{item.hot} <LikeSum />{item.likeSum} <ViewsSum />{item.viewSum} <CommentSum />{item.commentSum}</div>
                                                </Col>
                                                <Col span={6}>
                                                    <Button onClick={() => {
                                                        this.passArticle(item, index)
                                                    }} icon={<CheckOutlined />}>通过审核</Button>
                                                    <Button onClick={() => {
                                                        this.setState({
                                                            deleteIndex: index,
                                                            deleteItem: item,
                                                            showDeleteModel: true
                                                        })
                                                    }} icon={<DeleteOutlined />}>删除动态</Button>
                                                </Col>
                                            </Row>
                                            <div className={styles.list_item_text}>{item.text}</div>
                                            <div className={styles.list_item_image}>
                                                {item.pic.map((item, index) => (
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
                                    this.getArticleReview(e)
                                }} showSizeChanger={false} pageSize={15} total={this.state.articlesTotal }

                                />
                    </div>
                </PageContent>
            </>
        );
    }
}

export default ArticleReview;