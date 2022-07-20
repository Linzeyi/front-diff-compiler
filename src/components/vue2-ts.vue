<script lang="ts">
import { Foo, Baz, Qux, Fred } from './x'
// const a = 1
// function b() {}
export default class Heal extends Vue{
  private name:string='name'
  private age:number=20

  create(){
    console.log('create');
  }

  getData(){
    console.log('getData');
  }

  get computedVari(){
    return  'computedVari'
  }
}

</script>

<template>
  {{ a as Foo }}
  {{ Baz }}
  <Comp v-slot="{ data }: Qux">{{ data }}</Comp>
  <div v-for="{ z = x as Qux } in list as Fred"/>
</template>
         