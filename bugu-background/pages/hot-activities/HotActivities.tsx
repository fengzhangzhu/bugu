/* eslint-disable jsx-a11y/alt-text */
import { Button, Col, Form, Image, Input, InputNumber, List, message, Modal, Pagination, Row, Spin, Switch } from 'antd';
import * as React from 'react';
import PageContent from '../../components/PageContent';
import { ImageFatherPath, REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
import styles from '../../styles/pages/HotActivities.module.scss'
import { CommentSum, Fire, LikeSum, ViewsSum } from '../../components/MyIcons';
import { CheckOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
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
    video: number

}
interface HotActivitiesState {
    articles: ArticleItem[],
    listLoading: boolean,
    showChangeModel: boolean,
    changeItem?: ArticleItem,
    cahngeIndex?: number,
    changeHotNumber?: number,
    changeId?: number,
    pageNumber: number,
    articlesTotal: number,
    autoReduceHotNumber: number,
    autoReduceHotState: boolean,
    showChangeAutoReduceHotNumberModel: boolean,
    autoReduceHotChangeNumber: number
}
class HotActivities extends React.Component<any, HotActivitiesState> {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            listLoading: false,
            showChangeModel: false,
            pageNumber: 1,
            articlesTotal: 0,
            autoReduceHotNumber: 0,
            autoReduceHotState: false,
            showChangeAutoReduceHotNumberModel: false,
            autoReduceHotChangeNumber: 0
        };
    }
    componentDidMount() {
        this.getHotActivities()
        this.getAutoReduceHotNumber()
        this.getAutoReduceHotState()
    }
    private async getHotActivities(page: number = 1) {
        this.setState({
            listLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.getHotActivitiesList,
            data: {
                page: page
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
    /**
     * @function 修改热度值
     * @param id 动态的id
     * @param hot 热度值
     * @param index 动态在数组中的序号
     */
    private async changeHotNumber(id: number, hot: number, index: number = -1) {
        let data = {
            id: id,
            hot: hot
        }
        let path = `living/Manager/activity/${id}/hot/reset`
        console.log(path)
        request({
            method: 'PUT',
            url: path,
            data: data
        }).then(async data => {
            console.log(data)
            this.setState({
                showChangeModel: false
            })
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success("修改成功")
                if (index >= 0) {
                    let articles = this.state.articles
                    articles[index].hot = hot
                    this.setState({
                        articles
                    })
                }

            } else {
                message.error("修改失败")
            }
        })
    }
    /**
     * @function 获取自动降低的热度值
     */
    private async getAutoReduceHotNumber() {

        request({
            method: 'GET',
            url: servicePath.getAutoReduceHot,
            data: {
            }
        }).then(async data => {

            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    autoReduceHotNumber: data.data
                })
            } else {
                message.error("自动减少的热度值获取失败")
            }
        })
    }
    /**
     * @function 获取自动降低的热度值
     * @param hot 修改后的值
     */
    private async setAutoReduceHotNumber(hot: number) {

        request({
            method: 'PUT',
            url: servicePath.setAutoReduceHot,
            data: {
                hot: hot
            }
        }).then(async data => {
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success('修改成功')
                this.setState({
                    autoReduceHotNumber: hot,
                    showChangeAutoReduceHotNumberModel: false
                })
            } else {
                message.error("修改失败")
            }
        })
    }
    /**
     * @function 获取自动降低热度值的开启状态
     */
    private async getAutoReduceHotState() {

        request({
            method: 'GET',
            url: servicePath.getAutoReduceHotState,
            data: {
            }
        }).then(async data => {

            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    autoReduceHotState: data.data
                })
            } else {
                message.error("自动减少的热度值获取失败")
            }
        })
    }
    /**
     * @function 设置自动降低热度值的开启状态
     * @param state 自动降低热度值的开启状态
     */
    private async setAutoReduceHotState(state: boolean) {

        request({
            method: 'PUT',
            url: state ? servicePath.openAutoReduceHot : servicePath.closeAutoReduceHot,
            data: {

            }
        }).then(async data => {
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success('修改成功')
            } else {
                message.error("修改失败")

            }
            this.getAutoReduceHotState()
        })
    }
    render() {
        return (
            <>
                <PageContent selectKey={'/hot-activities/HotActivities'} title='热门动态'>

                    <Modal
                        title="修改动态热度"
                        visible={this.state.showChangeModel}
                        onOk={() => {
                            if (!this.state.changeId) {
                                message.error('请输入ID')
                                return
                            }
                            if (!this.state.changeHotNumber) {
                                message.error('请输入热度值')
                            } else {
                                this.changeHotNumber(this.state.changeId, this.state.changeHotNumber, this.state.cahngeIndex)
                            }

                        }}

                        okText='确认'
                        cancelText='取消'
                        onCancel={() => {
                            this.setState({
                                showChangeModel: false,
                                changeHotNumber: undefined,
                                changeItem: undefined,
                                cahngeIndex: undefined,
                                changeId: undefined
                            })
                        }}
                    >
                        <Form>
                            <Form.Item label="动态ID">
                                <Input
                                    required
                                    id="ChangeId"
                                    size="large"
                                    type={"number"}
                                    placeholder='请输入动态ID'
                                    value={this.state.changeId}
                                    onChange={(e) => {
                                        this.setState({
                                            changeId: Number(e.target.value)
                                        })
                                    }}
                                />
                            </Form.Item>
                        </Form>

                        <Form.Item label="热度值">
                            <Input
                                required
                                type={"number"}
                                id="Changehot"
                                size="large"
                                placeholder='请输入热度值'
                                value={this.state.changeHotNumber}
                                onChange={(e) => {
                                    this.setState({
                                        changeHotNumber: Number(e.target.value)
                                    })
                                }}
                            />
                        </Form.Item>


                    </Modal>
                    <Modal
                        title="修改自动减少的热度值"
                        visible={this.state.showChangeAutoReduceHotNumberModel}
                        onOk={() => {
                            if (this.state.autoReduceHotChangeNumber < 0) {
                                message.error("不能低于0")
                                return
                            }
                            this.setAutoReduceHotNumber(this.state.autoReduceHotChangeNumber)
                        }}
                        okText='确认'
                        cancelText='取消'
                        onCancel={() => {

                            this.setState({
                                showChangeAutoReduceHotNumberModel: false,
                                autoReduceHotChangeNumber: 0
                            })
                        }}
                    >
                        <Form.Item label="自动减少的热度值">
                            <Input
                                required
                                type={"number"}
                                id="Changehot"
                                size="large"
                                placeholder='请输入自动减少的热度值'
                                value={this.state.autoReduceHotChangeNumber}
                                onChange={(e) => {
                                    this.setState({
                                        autoReduceHotChangeNumber: Number(e.target.value)
                                    })
                                }}
                            />
                        </Form.Item>


                    </Modal>
                    <div className={styles.article_review_content} >
                        <div style={{
                            display: 'flex',
                            marginBottom: '10px',
                            flexWrap: 'wrap'
                        }}>

                            <Button style={{
                            }} onClick={() => {
                                this.setState({
                                    showChangeModel: true,
                                    changeHotNumber: undefined,
                                    changeId: undefined,
                                    cahngeIndex: -1
                                })
                            }} icon={<FormOutlined />}>修改指定id动态热度值</Button>

                            <div style={{
                                marginLeft: '20px'
                            }}>
                                当前自动减少的热度值:{this.state.autoReduceHotNumber}
                            </div>
                            <Button style={{
                                marginLeft: '20px'
                            }} onClick={() => {
                                this.setState({
                                    showChangeAutoReduceHotNumberModel: true,
                                    autoReduceHotChangeNumber: this.state.autoReduceHotNumber
                                })
                            }} icon={<FormOutlined />}

                            >设置自动减少的热度值</Button>
                            <div style={{
                                marginLeft: '20px'
                            }} >
                                是否开启热度值自动减少<Switch style={{
                                    marginLeft: '10px'
                                }} checked={this.state.autoReduceHotState} onChange={(e) => {
                                    this.setState({
                                        autoReduceHotState: e.valueOf()
                                    })
                                    this.setAutoReduceHotState(e.valueOf())
                                }} />
                            </div>
                        </div>
                        <Pagination defaultCurrent={1} current={this.state.pageNumber} onChange={(e) => {
                            this.setState({
                                pageNumber: e
                            })
                            this.getHotActivities(e)
                        }} showSizeChanger={false} pageSize={15} total={this.state.articlesTotal}

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
                                                    <div className={styles.list_item_tltle}>{index + 1}. <a>热度值:{item.hot}</a>  id:{item.id}  创建时间：{item.createTime} 更新时间：{item.updateTime}</div>
                                                    <div className={styles.list_item_info}> <LikeSum />{item.likeSum} <ViewsSum />{item.viewSum} <CommentSum />{item.commentSum}</div>
                                                </Col>
                                                <Col span={6}>
                                                    <Button onClick={() => {
                                                        this.setState({
                                                            showChangeModel: true,
                                                            changeItem: item,
                                                            cahngeIndex: index,
                                                            changeHotNumber: item.hot,
                                                            changeId: item.id
                                                        })
                                                    }} icon={<FormOutlined />}>修改热度值</Button>
                                                </Col>
                                            </Row>
                                            <div className={styles.list_item_text}>{item.text}</div>
                                            <div className={styles.list_item_image}>
                                                {item.video == 1 ?
                                                    <>
                                                        {item.pic.map((vido_item, index) => (
                                                            <video  width="320" height="240" controls key={vido_item}>
                                                                    <source src={vido_item} ></source>
                                                            </video>
                                                        ))}
                                                    </> :
                                                    <>
                                                        {item.pic.map((item, index) => (
                                                            <Image
                                                                key={index}
                                                                width={100}
                                                                height={100}
                                                                src={item}
                                                            />
                                                        ))}
                                                    </>}

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
                            this.getHotActivities(e)
                        }} showSizeChanger={false} pageSize={15} total={this.state.articlesTotal}

                        />
                    </div>
                </PageContent>
            </>
        );
    }
}

export default HotActivities;