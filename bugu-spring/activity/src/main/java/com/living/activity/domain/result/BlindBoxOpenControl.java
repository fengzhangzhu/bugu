package com.living.activity.domain.result;



public class BlindBoxOpenControl {

  private static boolean open = true;


  public static boolean isOpen() {
    return open;
  }

  public static void setOpen(boolean open) {
    BlindBoxOpenControl.open = open;
  }
}
