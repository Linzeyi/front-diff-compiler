<template>
  <div>Header</div>
</template>

<script>
export default {
  name: 'header',
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
  }
}
</script>