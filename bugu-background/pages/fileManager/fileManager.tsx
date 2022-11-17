/* eslint-disable react/jsx-key */
import { Breadcrumb, Button, Input, List, message, Modal, Spin,Image, Tree, Upload } from 'antd';
import * as React from 'react';
import PageContent from '../../components/PageContent';
import styles from '../../styles/pages/fileManager.module.scss'
import request, { servicePath } from '../../utils/request';
import "../../public/icon/wenjianjia.svg"
import { ArrowLeftOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Excel, Floder, ImageFile, Other, Pdf, Ppt, Radio, Txt, Video, Word } from '../../components/MyIcons';
import  Router from 'next/router';
import aes from '../../utils/aes/export';
import { REQUEST_SUCCEEDED_CODE } from '../../utils/constants';
interface FileManagerProps {

}

interface FileItem {
  type: string,
  name: string
}

interface FileRep {
  directory: string[],
  file: string[],
  url: string,

}
interface UploadFileNeed {
  key: string,
  token: string
}
interface FileManagerState {
  allFiles?: FileItem[],
  fileTree: string[],
  listLoading: boolean,
  fileUrl?: string,
  showCreatDirModel: boolean,
  confirmLoading: boolean,
  newDirName?: string,
  formFileName?: string,
  newFileName?: string,
  showRenameModel: boolean
  uploading: boolean,
  fileList: any[],
  uploadFileNeed?: UploadFileNeed
}
class FileManager extends React.Component<FileManagerProps, FileManagerState> {
  constructor(props: FileManagerProps) {
    super(props);
    this.state = {
      fileTree: [],
      listLoading: false,
      showCreatDirModel: false,
      confirmLoading: false,
      showRenameModel: false,
      uploading: false,
      fileList: []
    };
  }
  componentDidMount() {
    let token = localStorage.getItem('hbutback-token')
    if(!token){
      Router.push('/Login')
    }else{
        let name = localStorage.getItem('path')
       
        if(name){
            let fileTree= name.split('/')
            this.getFiles(fileTree)
        }else{
            this.getFiles()
        }
        
    }
  }
  componentWillUnmount(){
     localStorage.removeItem('fileTree')
  }
  //点击文件夹时打开文件
  async onClickFolder(foldername: string) {
    let fileTree = this.state.fileTree
    fileTree.push(foldername)
    this.getFiles(fileTree)
  }
  //点击导航时返回该目录
  async onBreadcrumbClick(FileManager: number = 0) {
    let fileTree = this.state.fileTree.slice(0, FileManager + 1)
    this.getFiles(fileTree)
  }
  //新建文件夹
  async makeNewDir() {
    let floderName: string = this.state.newDirName
    let father = this.state.fileTree.join('/')
    request({
      method: "POST",
      url: servicePath.CeartDirectory,
      data: {
        father: father,
        name: floderName
      }
    }).then(async data => {
      this.setState({
        listLoading: false
      })
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        message.success("创建成功")
        this.setState({
          showCreatDirModel: false
        })
        this.getFiles(this.state.fileTree)
      } else {
        message.error(data.userMsg)
      }
    })

  }
  //获取该目录下的所有文件
  async getFiles(fileTree: string[] = []) {
    this.setState({
      listLoading: true
    })
    let name = fileTree.join('/')
    
    request({
      method: 'GET',
      url: servicePath.GetFile,
      data: {
        name: name
      }
    }).then(async data => {
      this.setState({
        listLoading: false
      })
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        let father_folder = fileTree.join('/') + '/'
        let fileRep = data.data as FileRep
        let allFiles: FileItem[] = []
        fileRep.directory.map((item,index) => {
          allFiles.push({
            type: 'floder',
            name: item.replace(father_folder, '')
          })
        })
        fileRep.file.map((item, index) => {
          allFiles.push({
            type: 'image',
            name: item.replace(father_folder, '')
          })
        })
        this.setState({
          allFiles,
          fileUrl: fileRep.url,
          fileTree
        })
        await localStorage.setItem('path',name)//保存状态避免刷新之后回到根目录
      } else {
        message.error(data.userMsg)
        if(data.userMsg === "token超时,请重新登陆"){
          localStorage.clear()
          Router.push('/Login')
        }
      }
    })
  }
  //重命名文件
  async renameFile(FromName: String, ToName: String) {

    let father_path = this.state.fileTree.join('/')
    if (father_path.length > 0) {
      father_path = father_path + '/'
    }
    request({
      method: "POST",
      url: servicePath.RenameFile,
      data: {
        fromName: father_path + FromName,
        toName: father_path + ToName
      }
    }).then(async data => {
      this.setState({
        listLoading: false
      })
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        message.success("修改成功")
        this.setState({
          showRenameModel: false
        })
        this.getFiles(this.state.fileTree)
      } else {
        message.error(data.userMsg)
      }
    })
  }
  //删除文件夹
  async deleteDir(DirName: string) {
    let name: string
    if (this.state.fileTree.length > 0) {
      name = this.state.fileTree.join('/') + '/' + DirName
    } else {
      name = DirName
    }
    request({
      method: 'POST',
      url: servicePath.DeleteFloder,
      data: {
        directory: name
      }
    }).then(data => {
      this.setState({
        listLoading: false
      })
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        message.success("修改成功")
        this.setState({
          showRenameModel: false
        })
        this.getFiles(this.state.fileTree)
      } else {
        message.error(data.userMsg)
      }
    })
  }
  async deleteFile(Filename: string) {
    let name: string
    name = this.state.fileTree.join('/') + '/' + Filename
    request({
      method: 'POST',
      url: servicePath.DeleteFile,
      data: {
        fileName: name
      }
    }).then(data => {
      this.setState({
        listLoading: false
      })
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        message.success("修改成功")
        this.setState({
          showRenameModel: false
        })
        this.getFiles(this.state.fileTree)
      } else {
        message.error(data.userMsg)
      }
    })
  }
  //获取文件类型
  getFileIcon(fileName): JSX.Element {
    // 后缀获取
    let suffix = '';
    // 获取类型结果
    let result = '';
    try {
      const flieArr = fileName.split('.');
      suffix = flieArr[flieArr.length - 1];
    } catch (err) {
      suffix = '';
    }
    if (!suffix) { return <Other></Other>; }
    suffix = suffix.toLocaleLowerCase();
    // 图片格式
    const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
    // 进行图片匹配
    result = imglist.find(item => item === suffix);
    if (result) {
      // eslint-disable-next-line jsx-a11y/alt-text
      return <ImageFile></ImageFile>
    //   return <Image
    //   width={40}
    //   src={this.state.fileUrl+'/'+this.state.fileTree.join('/')+'/'+fileName}
    //   preview={{
    //     src: this.state.fileUrl+'/'+this.state.fileTree.join('/')+'/'+fileName,
    //   }}
    // />;
    }
    // 匹配txt
    const txtlist = ['txt'];
    result = txtlist.find(item => item === suffix);
    if (result) {
      return <Txt></Txt>;
    }
    // 匹配 excel
    const excelist = ['xls', 'xlsx'];
    result = excelist.find(item => item === suffix);
    if (result) {
      return <Excel></Excel>;
    }
    // 匹配 word
    const wordlist = ['doc', 'docx'];
    result = wordlist.find(item => item === suffix);
    if (result) {
      return <Word></Word>;
    }
    // 匹配 pdf
    const pdflist = ['pdf'];
    result = pdflist.find(item => item === suffix);
    if (result) {
      return <Pdf></Pdf>;
    }
    // 匹配 ppt
    const pptlist = ['ppt', 'pptx'];
    result = pptlist.find(item => item === suffix);
    if (result) {
      return <Ppt></Ppt>;
    }
    // 匹配 视频
    const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
    result = videolist.find(item => item === suffix);
    if (result) {
      return <Video></Video>;
    }
    // 匹配 音频
    const radiolist = ['mp3', 'wav', 'wmv'];
    result = radiolist.find(item => item === suffix);
    if (result) {
      return <Radio></Radio>;
    }
    // 其他 文件类型
    return <Other></Other>;
  }
  //上传文件前先获取授权
  BeforeUploadFile = async (file) => {
    let filename = file.name
    request({
      method: 'POST',
      url: servicePath.UploadFile,
      data: {
        directory: this.state.fileTree.join('/'),
        fileName: filename,
      }
    }).then(async data => {
      if (data.code == REQUEST_SUCCEEDED_CODE) {
        message.success("选择成功")
        let token = aes.decrypt(data.data.token)
        let filename = data.data.fileName
        this.setState({
          uploadFileNeed: {
            key: filename,
            token: token
          }
        })
      } else {
        message.error(data.userMsg)
      }
    })

  }
  handleUpload = () => {
    if (!this.state.uploadFileNeed) {
      message.error("无授权")
      return
    }
    const formData = new FormData();
    formData.append('file', this.state.fileList[0]);
    formData.append('key', this.state.uploadFileNeed.key);
    formData.append('token', this.state.uploadFileNeed.token);
    this.setState({
      uploading: true,
    });
    request({
      url: '/upload',
      method: 'POST',
      data: formData,
    }
    ).then(data => {

      this.setState({
        fileList: [],
        uploading: false,
      });
      this.getFiles(this.state.fileTree)
    })
  };
downloadFile(src:string,name:string){
    window.open(src)                    
 }
  render() {
    return (<>
      <PageContent selectKey={'/fileManager/fileManager'} title='文件管理'>
        <Modal
          title="新建文件"
          visible={this.state.showCreatDirModel}
          onOk={() => {
            if (!this.state.newDirName) {
              message.error('文件名不能为空')
            } else {
              this.makeNewDir()
            }

          }}
          confirmLoading={this.state.confirmLoading}
          okText='确认'
          cancelText='取消'
          onCancel={() => {
            this.setState({
              showCreatDirModel: false
            })
          }}
        >

          <Input
            required
            id="userName"
            size="large"
            placeholder="请输入文件夹的名字"
            value={this.state.newDirName}
            onChange={(e) => {
              this.setState({
                newDirName: e.target.value
              })
            }}
          />

        </Modal>
        <Modal
          title="修改文件名"
          visible={this.state.showRenameModel}
          onOk={() => {
            if (!this.state.newFileName) {
              message.error('文件名不能为空')
            } else {
              this.renameFile(this.state.formFileName, this.state.newFileName)
            }

          }}
          confirmLoading={this.state.confirmLoading}
          okText='确认'
          cancelText='取消'
          onCancel={() => {
            this.setState({
              showRenameModel: false
            })
          }}
        >

          <Input
            required
            id="newFileName"
            size="large"
            value={this.state.newFileName}
            onChange={(e) => {
              this.setState({
                newFileName: e.target.value
              })
            }}
          />

        </Modal>
        <div className={styles.file_manage_content}>
          <div className={styles.file_navigation}>
            <Breadcrumb>
              <Breadcrumb.Item
                onClick={() => {
                  this.getFiles()
                }}>
                根目录
              </Breadcrumb.Item>
              {this.state.fileTree.map((item, FileManager) => (
                <Breadcrumb.Item
                  onClick={() => {
                    this.onBreadcrumbClick(FileManager)
                  }}
                >
                  {item}
                </Breadcrumb.Item>))}
            </Breadcrumb>
          </div>
          <div className={styles.file_operation}>
            {this.state.fileTree.length > 0 && <><ArrowLeftOutlined style={{ marginRight: '10px' }} onClick={() => {
              let fileTree = this.state.fileTree
              this.getFiles(fileTree.slice(0, fileTree.length - 1))
            }} />
              <Upload
                onRemove={file => {
                  this.setState(state => {
                    const FileManager = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(FileManager, 1);
                    return {
                      fileList: newFileList,
                    };
                  });
                }}
                beforeUpload={file => {
                  this.setState({
                    fileList: [...this.state.fileList, file],
                  });
                  this.BeforeUploadFile(file)
                  return false;
                }}
                fileList={this.state.fileList}
                onChange={(info) => {
                  if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                  }
                  if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                  } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                  }
                }}
                progress={{
                  strokeColor: {
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  },
                  strokeWidth: 3,
                  format: percent => `${parseFloat(percent.toFixed(2))}%`,
                }}
                withCredentials={true}
              >
                <Button className={styles.file_operation_bttton} icon={<UploadOutlined />}>选择文件</Button>
              </Upload>
              <Button
                className={styles.file_operation_bttton}
                type="primary"
                onClick={this.handleUpload}
                disabled={this.state.fileList.length === 0}
                loading={this.state.uploading}
              >
                {this.state.uploading ? '上传完成' : '开始上传'}
              </Button>
            </>
            }
            {/* <input id='fileInput' type="file" ref="file" onChange={this.uploadFile} /> */}

            <Button className={styles.file_operation_bttton}
              onClick={() => {
                this.setState({
                  showCreatDirModel: true
                })
              }}
            >新建目录</Button>
          </div>

          <Spin spinning={this.state.listLoading}>
            <div className={styles.file_tree}>
              {this.state.allFiles &&
                <>
                  <List
                    itemLayout="horizontal"
                    dataSource={this.state.allFiles}
                    locale={{ emptyText: '这个目录下没有文件哦' }}
                    renderItem={item => (
                      <List.Item >
                        <div className={styles.file_list_item}>
                          {item.type === 'floder' ?
                            <Floder></Floder> :
                            this.getFileIcon(item.name)}<div className={styles.folder_name}
                              onClick={() => {
                                if(item.type==='floder'){
                                  this.onClickFolder(item.name)
                                }else{
                                  message.info('文件无法直接打开哦，请直接下载')
                                }
                              }}><a>{item.name}</a></div>
                          {item.type != 'floder' &&
                            <>
                              <a onClick={()=>{
                                this.downloadFile(this.state.fileUrl + '/' + this.state.fileTree.join('/') + '/' + item.name,item.name)
                              }}>
                                <Button 
                                style={{
                                  marginRight: '10px'
                                }} 
                                icon={<DownloadOutlined />} 
                                size='small'>下载
                                </Button></a>
                              <Button style={{
                                marginRight: '10px'
                              }}
                                icon={<EditOutlined />}
                                size='small'
                                onClick={() => {
                                  this.setState({
                                    newFileName: item.name,
                                    formFileName: item.name,
                                    showRenameModel: true
                                  })
                                }}
                              >重命名</Button>
                            </>
                          }

                          <Button icon={<DeleteOutlined />} size='small'
                            onClick={() => {
                              Modal.confirm({
                                title: '删除文件',
                                content: `你确定要将${item.name}删除吗，删除后无法恢复`,
                                okText: '确认',
                                onOk: () => {
                                  if (item.type === 'floder') {
                                    this.deleteDir(item.name)
                                  } else {
                                    this.deleteFile(item.name)
                                  }
                                },
                                cancelText: '取消'
                              })
                            }}

                          >删除</Button>
                        </div>
                      </List.Item>
                    )}
                  />
                </>

              }

            </div>
          </Spin>
        </div>
      </PageContent>
    </>
    );
  }
}

export default FileManager;