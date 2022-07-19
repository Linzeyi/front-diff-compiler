<template>
  <div>Hello world!</div>
</template>

<script>
  export default {
    props: {
      initialCounter: {
        type: Number,
        required: true,
      },
      step: {
        type: Number,
        default: 1,
      },
    },
    data () {
      return {
        counter: 0,
      }
    },
    computed: {
      message() {
        return `Current value is ${this.counter}`;
      }
    },
    methods: {
      /** 相加
       * @test 100122
       */
      increment() {
        this.counter += 1;
        this.$emit('increment', this.counter);
      },

      /** 相加
       * @test 100121
       */
      decrement() {
        this.counter -= 1;
        this.$emit('decrement', this.counter);
      }
    }
  }
</script>