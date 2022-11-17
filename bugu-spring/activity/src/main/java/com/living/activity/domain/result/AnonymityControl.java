package com.living.activity.domain.result;


public class AnonymityControl {

  private static boolean open = true;

  public static boolean isOpen() {
    return open;
  }

  public static void setOpen(boolean open) {
    AnonymityControl.open = open;
  }
}
