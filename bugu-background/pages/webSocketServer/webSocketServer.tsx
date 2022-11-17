import { Card, Col, Row, Statistic } from 'antd';
import * as React from 'react';

interface WebSocketTestProps {
    
}
 
interface WebSocketTestState {
    messageData:string
}
 
class WebSocketTest extends React.Component<WebSocketTestProps, WebSocketTestState> {
    constructor(props: WebSocketTestProps) {
        super(props);
        this.state = { messageData: '' };
    }
    componentDidMount() { 
        let ws = new WebSocket("ws://116.62.194.97:20000/webSocketServer");
           if (typeof (WebSocket) == "undefined") {
             console.log("遗憾：您的浏览器不支持WebSocket");
           } else {
             console.log("恭喜：您的浏览器支持WebSocket");
             ws.onopen = (evt)=> {
               console.log("Connection open ...");
               ws.send("管理平台");
               ws.send("新增人数");
             };
        
             ws.onmessage = (evt)=> {
               console.log( "Received Message: " + evt.data);
               // alert(evt.data)
               //this.state.messageData 为接受数据的变量
               let messageData=this.state.messageData;
               this.setState({
                 messageData:evt.data
               })
               // ws.close();
             };
             ws.onclose = (evt)=> {
               // alert(evt.data)
               console.log("Connection closed.");
               // ws.close();
             };
             ws.onerror = (evt)=> {
               console.log("error")
             };
             window.onbeforeunload = (event)=> {
               console.log("关闭WebSocket连接！");
               ws.send("关闭页面");
               event.close();
             }
         
         }
        }
    render() { 
        return ( <div  style={{
            background: '#ececec',
            padding: '10px',
            width:'20%',
            float:'left',marginTop:'20px'
          }}>
            <Row gutter={16}>
              <Col span={12}>
                <Card>
                  <Statistic
                    title="管理平台当前在线人数"
                    value={this.state.messageData}
                    precision={0}
                    valueStyle={{ color: '#3f8600' }}
                    suffix="人"
                  />
                </Card>
              </Col>
 
            </Row>
          </div>
        )
    }
}
 
export default WebSocketTest;