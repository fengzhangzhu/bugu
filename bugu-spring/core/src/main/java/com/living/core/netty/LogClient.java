package com.living.core.netty;


import com.google.gson.Gson;

import com.living.core.domain.dao.ApiErrorLog;
import com.living.core.domain.dao.ApiResultLog;
import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.DatagramPacket;
import io.netty.channel.socket.nio.NioDatagramChannel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class LogClient {

  @Value("${log.port}")
  private int logPort;

  private Channel channel;

  @Value("${server.port}")
  private int serverPort;

  private static volatile InetSocketAddress address;


  private InetSocketAddress getAddress(){
    if(address==null){
      synchronized (LogClient.class){
        if(address==null){
          return new InetSocketAddress("116.62.194.97", logPort);
        }else {
          return address;
        }
      }
    }else {
      return address;
    }
  }


  public void connect(){
    EventLoopGroup group = new NioEventLoopGroup();
    try {
      Bootstrap bootstrap = new Bootstrap();
      bootstrap.group(group)
          .channel(NioDatagramChannel.class)
          .option(ChannelOption.SO_SNDBUF,1024*1024)
          .handler(new ChannelInitializer<NioDatagramChannel>() {
            @Override
            protected void initChannel(NioDatagramChannel ch) {
              ChannelPipeline pipeline = ch.pipeline();
//              pipeline.addLast(new UdpClientHandler());
            }
          });
      channel = bootstrap.bind(serverPort).sync().channel();
      channel.closeFuture().sync();
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      group.shutdownGracefully();
    }
  }

  @Async("ApiLog")
  public void send(ApiErrorLog apiErrorLog){
    String error = new Gson().toJson(apiErrorLog);
    error="[error]"+error;
    ByteBuf byteBuf = Unpooled.copiedBuffer(error.getBytes(StandardCharsets.UTF_8));
    try {
      channel.writeAndFlush(new DatagramPacket(byteBuf, getAddress())).sync();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  @Async("ApiLog")
  public void send(ApiResultLog apiResultLog){
    long start = System.nanoTime();
    String result = new Gson().toJson(apiResultLog);
    result="[result]"+result;
    ByteBuf byteBuf = Unpooled.copiedBuffer(result.getBytes(StandardCharsets.UTF_8));
    try {
      channel.writeAndFlush(new DatagramPacket(byteBuf, getAddress())).sync();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    long end = System.nanoTime();
    long time = end-start;
    log.info("send log time:"+ TimeUnit.NANOSECONDS.toMillis(time));
  }

  @Async("ApiLog")
  public void sendManagerErrorLog(ApiErrorLog apiErrorLog){
    String error = new Gson().toJson(apiErrorLog);
    error="[manager.error]"+error;
    ByteBuf byteBuf = Unpooled.copiedBuffer(error.getBytes(StandardCharsets.UTF_8));
    try {
      channel.writeAndFlush(new DatagramPacket(byteBuf, getAddress())).sync();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  @Async("ApiLog")
  public void sendManagerResultLog(ApiResultLog apiResultLog){
    long start = System.nanoTime();
    String result = new Gson().toJson(apiResultLog);
    result="[manager.result]"+result;
    ByteBuf byteBuf = Unpooled.copiedBuffer(result.getBytes(StandardCharsets.UTF_8));
    try {
      channel.writeAndFlush(new DatagramPacket(byteBuf, getAddress())).sync();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    long end = System.nanoTime();
    long time = end-start;
    log.info("send log time:"+ TimeUnit.NANOSECONDS.toMillis(time));
  }



}
