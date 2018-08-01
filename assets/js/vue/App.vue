<template>
    <kanban-board :stages="board.stages" :blocks="board.blocks">
        <div v-for="block in board.blocks" :slot="block.id">
            <div>
                <strong>id:</strong> {{ block.number }}
            </div>
            <div>
                {{ block.title }}
            </div>
            <div>
                <i>{{ block.estimate }} hrs</i>
            </div>
        </div>
    </kanban-board>
</template>
<script>
    export default {
      name: "app",
      props: ['board'],
      data: function () {
        return {};
      }
    }
</script>
<style lang="scss">
    @import '../../../node_modules/vue-kanban/src/assets/kanban';
    .drag-item {
        &.is-moving {
            transform: scale(1.15);
            background: rgba(black, 0.25);
        }
    }
</style>