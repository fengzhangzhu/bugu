/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-key */
import { Breadcrumb, Button, Input, List, message, Modal, Spin, Image, Tree, Upload, Row, Col, Card, Switch, Carousel } from 'antd';
import * as React from 'react';
import PageContent from '../components/PageContent';
import styles from '../styles/pages/index.module.scss'
import request, { servicePath } from '../utils/request';
import "../public/icon/wenjianjia.svg"
import { ArrowLeftOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Excel, Floder, ImageFile, Other, Pdf, Ppt, Radio, Txt, Video, Word } from '../components/MyIcons';
import Router from 'next/router';
import aes from '../utils/aes/export';
import { REQUEST_SUCCEEDED_CODE } from '../utils/constants';
interface IndexProps {

}
interface BannerItem {
  id: number,
  pic: string
}

interface IndexState {
  storeSum: number,
  boxOpenSate: boolean,
  bannerList: BannerItem[],
  showAddBannerItemModel: boolean
  addBannerPic: string,
  anonymityState:boolean
}
class Index extends React.Component<IndexProps, IndexState> {
  constructor(props: IndexProps) {
    super(props);
    this.state = {
      storeSum: 0,
      boxOpenSate: false,
      bannerList: [],
      showAddBannerItemModel: false,
      addBannerPic: 'banner/',
      anonymityState:false
    };
  }
  componentDidMount() {
    let token = localStorage.getItem('hbutback-token')
    if (!token) {
      Router.push('/Login')
    } else {
      this.getOnlineNumber()
      this.getBoxOpenState()
      this.getAnonymityState()
      this.getBannerList()
    }
  }

  private getOnlineNumber() {
    request({
      method: 'GET',
      url: servicePath.OnlineNumber,
      data: {},
    }).then(data => {
      console.log(data)
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        message.success('获取成功')
        this.setState({
          storeSum: data.data.storeSum
        })
      } else {
        message.error('获取失败')
      }
    })
  }
  /**
   * @function 获取盲盒开放状态
   */
  private getBoxOpenState() {
    request({
      method: 'GET',
      url: servicePath.getBoxOpenState,
      data: {},
    }).then(data => {
      console.log(data)
      if (data.code == REQUEST_SUCCEEDED_CODE) {

        this.setState({
          boxOpenSate: data.data
        })
      } else {
        message.error('获取失败')
      }
    })
  }
  /**
    * @function 控制盲盒开放状态
    * @param open {number} 是否开放 0否 1是
    */
  private blindBoxControl(open: number = 1) {
    request({
      method: 'POST',
      url: servicePath.blindBoxControl,
      data: {
        open: open
      },
    }).then(data => {
      if (data.code == REQUEST_SUCCEEDED_CODE) {

        message.success('设置成功')
      } else {
        message.error('设置失败')
      }
      this.getBoxOpenState()
    })
  }
  /**
    * @function 获取轮播图列表
    */
  private getBannerList() {
    request({
      method: 'GET',
      url: servicePath.getBannerList,
      data: {
      },
    }).then(data => {
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        this.setState({
          bannerList: data.data
        })
      } else {
        message.error('轮播图获取失败')
      }

    })
  }
  /**
    * @function 删除轮播图
    * @param id 轮播图的id
    */
  private deleteBannerItem(id: number) {
    request({
      method: 'DELETE',
      url: servicePath.deleteBannerItem,
      data: {

        id: id

      },
    }).then(data => {
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        message.success('删除成功')
        this.getBannerList()
      } else {
        message.error('删除失败')
      }
    })
  }
  /**
      * @function 添加轮播图
      * @param pic 文件链接
      */
  private addBannerItem(pic: string) {
    request({
      method: 'POST',
      url: servicePath.addBannerItem,
      data: {
        pic: pic
      },
    }).then(data => {
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        message.success('添加成功')
        this.getBannerList()
      } else {
        message.error('添加失败')
      }
    })
  }
   /**
   * @function 获取匿名开放状态
   */
    private getAnonymityState() {
      request({
        method: 'GET',
        url: servicePath.getAnonymityState,
        data: {},
      }).then(data => {
        console.log(data)
        if (data.code == REQUEST_SUCCEEDED_CODE) {
  
          this.setState({
            anonymityState: data.data
          })
        } else {
          message.error('匿名开放状态获取失败')
        }
      })
    }
    /**
      * @function 控制盲盒开放状态
      * @param open {number} 是否开放 0否 1是
      */
    private anonymityControl(open:boolean) {
      request({
        method: 'PUT',
        url: open?servicePath.openAnonymity:servicePath.closeAnonymity,
        data: {
          open: open
        },
      }).then(data => {
        if (data.code == REQUEST_SUCCEEDED_CODE) {
  
          message.success('设置成功')
        } else {
          message.error('设置失败')
        }
        this.getAnonymityState()
      })
    }
  render() {
    return (<>
      <PageContent selectKey={'/'} title='后台管理系统'>

        <div className={styles.index_content}>
          <Modal
            title="添加新的轮播图"
            visible={this.state.showAddBannerItemModel}
            onOk={() => {
              if (!this.state.addBannerPic) {
                message.error('请输入图片相对地址')
              } else {
                this.addBannerItem(this.state.addBannerPic)
                this.setState({
                  addBannerPic: 'banner/',
                  showAddBannerItemModel: false
                })
              }

            }}

            okText='确认'
            cancelText='取消'
            onCancel={() => {
              this.setState({
                showAddBannerItemModel: false,
                addBannerPic: 'banner/',
              })
            }}
          >

            <Input
              required
              id="newFileName"
              size="large"
              placeholder='请输入图片相对地址'
              value={this.state.addBannerPic}
              onChange={(e) => {
                this.setState({
                  addBannerPic: e.target.value
                })
              }}
            />

          </Modal>
          <div className="site-card-wrapper">
            <Row gutter={16}>
              <Col span={6}>
                <Card title={<div className={styles.card_title}>实际在线人数</div>} size='small' style={{ backgroundColor: '#CCC2B7' }} bordered={false}>
                  <div className={styles.card_content}>{this.state.storeSum}</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card title={<div className={styles.card_title}>盲盒开启状态</div>} size='small' style={{ backgroundColor: '#CCC2B7' }} bordered={false}>
                  <div className={styles.card_content}>
                    <div className={styles.boxControl_text}>
                      是否开启盲盒
                    </div>
                    <div className={styles.boxControl_switch}>
                      <Switch checked={this.state.boxOpenSate} onChange={(e) => {
                        this.setState({
                          boxOpenSate: e.valueOf()
                        })
                        this.blindBoxControl(e.valueOf() ? 1 : 0)
                      }} />
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card title={<div className={styles.card_title}>匿名开放状态</div>} size='small' style={{ backgroundColor: '#CCC2B7' }} bordered={false}>
                  <div className={styles.card_content}>
                    <div className={styles.boxControl_text}>
                      是否开放匿名
                    </div>
                    <div className={styles.boxControl_switch}>
                      <Switch checked={this.state.anonymityState} onChange={(e) => {
                        this.setState({
                          anonymityState: e.valueOf()
                        })
                        this.anonymityControl(e.valueOf())
                      }} />
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>


            <div className={styles.banner_card}>
              <div className={styles.banner_card_title}>
              <div className={styles.title_content}><div className={styles.title_text}>首页轮播图</div><div className={styles.title_button}><Button type="primary" shape='round'
                onClick={() => {
                  this.setState({
                    showAddBannerItemModel: true
                  })
                }}

              >添加</Button></div></div>
              </div>
              <div className={styles.banner_card_content}>
                <Carousel className={styles.banner_Carousel} autoplay>
                  {this.state.bannerList.length < 1 &&
                    <div>
                      <div className={styles.banner_image_content}>
                        还未上传任何图片
                      </div>
                    </div>}
                  {this.state.bannerList.map((item, index) => (
                    <div key={item.id}>
                      <div className={styles.banner_image_content}>
                        <Image
                          src={item.pic}
                          className={styles.banner_image}
                          preview={false}
                          height='230px'
                          width='470px'
                        >
                        </Image>
                        <div className={styles.banner_button}>
                        <Button type="primary" shape='round'
                onClick={() => {
                 this.deleteBannerItem(item.id)
                }}

              >删除</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </>
    );
  }
}

export default Index;