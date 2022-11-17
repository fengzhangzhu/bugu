/* eslint-disable jsx-a11y/alt-text */
import { CheckOutlined, DeleteOutlined, ReadOutlined } from '@ant-design/icons';
import { Input, List, Modal, Spin, Image, Button, Pagination, message } from 'antd';
import * as React from 'react';
import styles from '../../styles/pages/officialNews.module.scss'
import { Component } from 'react';
import PageContent from '../../components/PageContent';
import request, { servicePath } from '../../utils/request';
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
interface OfficialNewsProps {

}
interface officialNewsItem {
    createTime: string,
    id: number
    pic: string[]
    text: string
}
interface officialNewsDetail {
    createTime: string
    id: number
    isRead: number
    updateTime: string
    userId: number
}

interface OfficialNewsState {
    pageNumber: number
    isLoading: boolean
    officialNews: officialNewsItem[]
    deleteItem?: officialNewsItem
    deleteIndex?: number
    total: number
    openDetailModal: boolean
    newsDetail?: officialNewsDetail

}

class OfficialNews extends React.Component<OfficialNewsProps, OfficialNewsState> {
    constructor(props: OfficialNewsProps) {
        super(props);
        this.state = {
            pageNumber: 1,
            isLoading: false,
            officialNews: [],
            total: 0,
            openDetailModal: false

        };
    }
    componentDidMount() {
        this.getOfficialNews(1)
    }
    //获取官方发布的消息
    private async getOfficialNews(page: number) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.OfficialNewsList,
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
                    officialNews: data.data.messageResultList as officialNewsItem[],
                    total: data.data.total
                })
            } else {
                message.error("获取失败")
            }
        })

    }
    /**
     * @function 获取消息的详细信息
     * @param id 消息的id
     */
    private async getOfficialNewsDetail(id: number) {
        request({
            method: 'GET',
            url: servicePath.OfficialNewsAction + `/${id}/detail`,
            data: {
                id: id
            }
        }).then(async data => {

            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                this.setState({
                    newsDetail: data.data[0],
                    openDetailModal:true
                })
            } else {
                message.error("获取失败")
            }
        })

    }
    render() {
        return (

            <PageContent selectKey='/official-news/officialNews' title='官方消息'>
                <div className={styles.official_new_content}>
                    <Modal
                        title="消息详情"
                        visible={this.state.openDetailModal}
                        onOk={() => {
                            this.setState({
                                openDetailModal: false,
                                newsDetail:undefined
                            })

                        }}

                        okText='确认'
                        cancelText='取消'
                        onCancel={() => {
                            this.setState({
                                openDetailModal: false,
                                newsDetail:undefined
                            })
                        }}
                    >
                        <div className={styles.news_detail_item}>
                            创建时间：{this.state.newsDetail?.createTime}
                        </div>
                        <div className={styles.news_detail_item}>
                            id：{this.state.newsDetail?.id}
                        </div>
                        <div className={styles.news_detail_item}>
                            是否已读：{this.state.newsDetail?.isRead==1?'是':'否'}
                        </div>
                        <div className={styles.news_detail_item}>
                            更新时间：{this.state.newsDetail?.updateTime}
                        </div>
                        <div className={styles.news_detail_item}>
                            用户id：{this.state.newsDetail?.userId}
                        </div>
                    </Modal>
                    <Spin spinning={this.state.isLoading}>
                        <List
                            dataSource={this.state.officialNews}
                            renderItem={(item, index) => (<List.Item
                                key={index}
                            >
                                <List.Item.Meta
                                    title={<div style={{
                                        display: 'flex'
                                    }}><h3>{index + 1}.<a >id:{item.id} 发布时间：{item.createTime}</a></h3>
                                        <Button className={styles.official_new_button} size='small' onClick={() => {
                                            this.getOfficialNewsDetail(item.id)
                                        }} icon={<ReadOutlined />}>查看详细信息</Button>


                                    </div>}
                                    description={
                                        <div className='official-news-description'>
                                            <div>
                                                {item.text}
                                            </div>
                                            {item.pic && item.pic.length > 10 &&
                                                <div className='official-news-images'>
                                                    {item.pic.map((picItem, index) => (
                                                        <Image
                                                            className='image-item'
                                                            key={picItem}
                                                            height='100'
                                                            src={picItem}
                                                        >
                                                        </Image>
                                                    ))}

                                                </div>
                                            }
                                        </div>
                                    }
                                />

                            </List.Item>)}
                        >


                        </List>
                        <Pagination pageSize={15} current={this.state.pageNumber} total={this.state.total} onChange={(e) => {
                            this.getOfficialNews(e)
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

export default OfficialNews;