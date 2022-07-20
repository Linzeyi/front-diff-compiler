<template>
  <div>
    <normal-cash-coupon v-if="payScene === 'common'"></normal-cash-coupon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { PayCommon } from '../types/payCommon';
import usePayCashCoupon from '../hooks/coupon/usePayCashCoupon';
import NormalCashCoupon from '../payscene/normal/NormalCashCoupon.vue';

export default defineComponent({
  name: 'PayCashCoupon',
  setup(props: PayCommon.Data, ctx: PayCommon.SetupContext) {
    const payCashCoupon = usePayCashCoupon(ctx);
    return {
      ...payCashCoupon
    };
  },
  components: {
    NormalCashCoupon
  }
});
</script>
