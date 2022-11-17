package com.living.activity.domain.result;

import com.living.activity.domain.helper.BlindBoxTicketHelper;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BlindBoxTicketResult {
  private int availableSum;
  private List<BlindBoxTicketHelper> tickets;
}
