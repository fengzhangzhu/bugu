/* eslint-disable @next/next/no-img-element */
import { Button, List, message, Pagination, Spin,Image, Modal, Input } from 'antd';
import * as React from 'react';
import PageContent from '../../components/PageContent';
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
import styles from '../../styles/pages/AvatarReview.module.scss'
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';

interface AvatarReviewProps {

}
interface AvatarItem {
    avatar: string
    createTime: string
    id: number
    userId: number
}

interface AvatarReviewState {
    isLoading: boolean,
    avatars?: AvatarItem[],
    pageNumber:number,
    total:number,
    showDeleteModel:boolean,
    deleteReason:string,
    deleteItem?:AvatarItem,
    deleteIndex:number

}
//  穆兰 2021年10月17日 头像审核
class AvatarReview extends React.Component<AvatarReviewProps, AvatarReviewState> {
    constructor(props: AvatarReviewProps) {
        super(props);
        this.state = {
            isLoading: false,
            total:1,
            pageNumber:1,
            showDeleteModel:false,
            deleteReason:'',
            deleteIndex:0
        };
    }
    componentDidMount() {
        this.getAvatarNotReview()
    }
    private getAvatarNotReview(page: number = 1) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.AvatarReview,
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
                    avatars: data.data.list as AvatarItem[],
                    total:data.data.total
                })
            } else {
                message.error("获取失败")
            }
        })
    }
    private async passAvatar(avatarItem: AvatarItem, index: number) {
        request({
            method: 'DELETE',
            url: servicePath.AvatarPass,
            data: {
               userId:avatarItem.userId
            }
        }).then(async data => {
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success("通过成功")
                let avatars = this.state.avatars
                avatars.splice(index, 1)
                await this.setState({
                    avatars
                })
            } else {
                message.error("通过失败")
            }
        })
    }
    private async deleteAvatar() {
        let avatarItem: AvatarItem = this.state.deleteItem
        let index: number = this.state.deleteIndex
        let data = {
            reason: `您于${avatarItem.createTime}上传的头像因 ${this.state.deleteReason} 已被删除,您的头像已恢复为默认头像`,
            userId: avatarItem.userId
        }
        let path = servicePath.AvatarDelete
        console.log(path)
        request({
            method: 'DELETE',
            url: path,
            data:data
        }).then(async data => {
            console.log(data)
            this.setState({
                showDeleteModel:false
            })
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                message.success("删除成功")
                let avatars = this.state.avatars
                avatars.splice(index, 1)
                console.log(avatars)
                this.setState({
                    avatars
                })
            } else {
                message.error("删除失败")
            }
        })
    }

    render() {
        return (<PageContent selectKey='/avatar-review/AvatarReview' title='头像审核'>
            <div className={styles.avatar_review_content}>
            <Modal
                        title="你确定要删除这个头像吗？"
                        visible={this.state.showDeleteModel}
                        onOk={() => {
                            if (!this.state.deleteReason) {
                                message.error('请输入删除原因')
                            } else {
                                this.deleteAvatar()
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
                <Spin spinning={this.state.isLoading}>
                    <List
                        dataSource={this.state.avatars}
                        renderItem={(item, index) => (<List.Item
                            key={index}
                            extra={
                                <Image
                                    style={{
                                        maxWidth:'200px'
                                    }}
                                    height={100}
                                    alt="logo"
                                    src={item.avatar}
                                />
                            }
                        >
                            <List.Item.Meta
                                title={<div style={{
                                    display: 'flex'
                                }}><h3>{index + 1}.<a >id:{item.id} userId:{item.userId} 更新时间：{item.createTime}</a></h3>
                                    <Button className={styles.avatar_review_button} size='small' onClick={() => {
                                       this.passAvatar(item,index)
                                    }} icon={<CheckOutlined />}>通过审核</Button>
                                    <Button className={styles.avatar_review_button} size='small' onClick={() => {
                                       
                                       this.setState({
                                           showDeleteModel:true,
                                           deleteItem:item,
                                           deleteIndex:index
                                       })

                                    }} icon={<DeleteOutlined />}>删除头像</Button>
                                </div>}

                            />

                        </List.Item>)}
                    >


                    </List>
                    <Pagination current={this.state.pageNumber} total={this.state.total} onChange={(e)=>{
                        this.getAvatarNotReview(e)
                        this.setState({
                            pageNumber:e
                        })
                    }} />
                </Spin>
            </div>
        </PageContent>);
    }
}

export default AvatarReview;