import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Input, List, message, Modal, Pagination, Spin,Image,Form} from 'antd';
import * as React from 'react';
import { Component } from 'react';
import PageContent from '../../components/PageContent';
import styles from '../../styles/pages/AuthenticationReview.module.scss'
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
import request, { servicePath } from '../../utils/request';
interface AuthenticationReviewProps {

}
interface AuthenticationItem {
    createTime: string
    id: number
    pic: string
    sex: number
    stuId: string
    userId:number
}



interface AuthenticationReviewState {
    showDeleteModel: boolean
    deleteReason?: string
    isLoading: boolean
    pageNumber: number
    authenticationList:AuthenticationItem[]
    total:number
    deleteItem?:AuthenticationItem
    passItem?:AuthenticationItem
    deleteIndex?:number
    showPassModel: boolean
    stuId:string,
    sex?:number,
    passIndex?:number
}

class AuthenticationReview extends React.Component<AuthenticationReviewProps, AuthenticationReviewState> {
    constructor(props: AuthenticationReviewProps) {
        super(props);
        this.state = {
            showDeleteModel: false,
            isLoading: false,
            pageNumber: 1,
            authenticationList:[],
            total:0,
            showPassModel:false,
            stuId:''

        };
    }
    componentDidMount() {
        this.getAuthenticationNotReview()
    }
    private getAuthenticationNotReview(page: number = 1) {
        this.setState({
            isLoading: true
        })
        request({
            method: 'GET',
            url: servicePath.AuthenticationReview,
            data: {
                page: page
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                console.log(data)
                this.setState({
                   authenticationList: data.data.list as AuthenticationItem[],
                   total:data.data.total
                })
            } else {
                message.error(data.userMsg)
            }
        })
    }
    //通过实名认证请求
    private passAuthentication(id:number,index:number,stuId:string,sex?:number){
        this.setState({
            isLoading: true
        })
        request({
            method: 'POST',
            url: servicePath.AuthenticationAction+`${id}/pass`,
            data: {
                id: id,
                stuId:stuId,
                sex:sex
            }
        }).then(async data => {
            this.setState({
                isLoading: false
            })
            console.log(data)
            if (data.code === REQUEST_SUCCEEDED_CODE) {
                let authenticationList = this.state.authenticationList
                authenticationList.splice(index,1)
                this.setState({
                    authenticationList 
                })
               message.success('通过成功')
            } else {
                message.error(data.userMsg)
            }
        })
    }
//拒绝实名认证请求
private deleteAuthentication(id:number,reason:string,index:number){
    this.setState({
        isLoading: true
    })
    request({
        method: 'DELETE',
        url: servicePath.AuthenticationAction+`${id}/delete`,
        data: {
            id: id,
            reason:reason
        }
    }).then(async data => {
        this.setState({
            isLoading: false
        })
        console.log(data)
        if (data.code === REQUEST_SUCCEEDED_CODE) {
            let authenticationList = this.state.authenticationList
            authenticationList.splice(index,1)
            this.setState({
                authenticationList 
            })
           message.success('删除成功')
        } else {
            message.error(data.userMsg)
        }
    })
}
    render() {
        return (
            <PageContent selectKey='/authentication-review/AuthenticationReview' title='实名认证审核'>
                <div className={styles.authentication_review_content}>
                    <Modal
                        title="你确定要删除这个认证请求吗？"
                        visible={this.state.showDeleteModel}
                        onOk={() => {
                            if(this.state.deleteReason.length>1){
                                this.deleteAuthentication(this.state.deleteItem.id,this.state.deleteReason,this.state.deleteIndex)
                                this.setState({
                                    showDeleteModel: false,
                                    deleteReason: undefined,
                                    deleteItem: undefined,
                                    deleteIndex: undefined
                                })
                            }else{
                                message.error('请先输入原因')
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
                    <Modal
                        title="请输入学号和性别"
                        visible={this.state.showPassModel}
                        onOk={() => {
                            if(this.state.stuId.length>1){
                                this.passAuthentication(this.state.passItem.id,this.state.passIndex,this.state.stuId,this.state.sex)
                                this.setState({
                                    showPassModel: false,
                                    stuId:'',
                                    sex: undefined,
                                })
                            }else{
                                message.error('请输入学号')
                            }
                        }}
                        okText='确认'
                        cancelText='取消'
                        onCancel={() => {
                            this.setState({
                                showPassModel: false,
                                    stuId:'',
                                    sex: undefined,
                            })
                        }}
                    >

                            <Form.Item label="学号">
                                <Input
                                    required
                                    id="stuId"
                                    size="large"
                                    placeholder='请输入学号'
                                    value={this.state.stuId}
                                    onChange={(e) => {
                                        this.setState({
                                            stuId: e.target.value
                                        })
                                    }}
                                />
                            </Form.Item>

                            <Form.Item label="性别(0女1男)">
                                <Input
                                    required
                                    id="sex"
                                    size="large"
                                    placeholder='请输入性别'
                                    value={this.state.sex}
                                    onChange={(e) => {
                                        this.setState({
                                            sex: Number(e.target.value)
                                        })
                                    }}
                                />
                            </Form.Item>

                    </Modal>
                    
                    <Spin spinning={this.state.isLoading}>
                        <List
                            dataSource={this.state.authenticationList}
                            renderItem={(item, index) => (<List.Item
                                key={index}
                                extra={
                                    <Image
                                      height={150}
                                      alt="picture"
                                      src={item.pic}
                                    />
                                  }
                                >
                                
                                <List.Item.Meta
    
                                    title={<div style={{
                                        display: 'flex'
                                    }}><h3>{index + 1}.<a >Id:{item.id} userId:{item.userId}  上传时间：{item.createTime}</a></h3>
                                        <Button className={styles.authentication_review_button} size='small' onClick={() => {
                                            this.setState({
                                                showPassModel:true,
                                                passItem:item,
                                                passIndex:index
                                            })
                                        }} icon={<CheckOutlined />}>通过审核</Button>
                                        <Button className={styles.authentication_review_button} size='small' onClick={() => {

                                            this.setState({
                                                showDeleteModel: true,
                                                deleteItem: item,
                                                deleteIndex: index
                                            })

                                        }} icon={<DeleteOutlined />}>拒接认证</Button>
                                    </div>}
                                    description={'学号：'+item.stuId}
                                />

                            </List.Item>)}
                        >


                        </List>
                        <Pagination current={this.state.pageNumber} total={this.state.total} onChange={(e) => {
                            this.getAuthenticationNotReview(e)
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

export default AuthenticationReview;