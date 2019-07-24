<template>
  <div class="rule-container">
    <div :class="[{'rule-item': true}, `rule-type-${ rule.type }`]" v-for="rule in rules" :key="rule.id">
      <div class="rule-title">
        <div class="rule-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" >
            <path fill="#fff" d="M131.187 19.652c-32.212 0-58.423 25.972-58.423 57.775L70.64 376.98l31.867.227 2.125-299.663c0-14.35 11.913-26.025 26.556-26.025h320.266V19.65H131.187z"/>
            <path fill="#fff" d="M451.452 19.652c-33.386 0-60.548 27.16-60.548 60.548v336.2c0 24.303-19.78 44.082-44.083 44.082s-44.082-19.78-44.082-44.083v-38.773c0-8.8-7.133-15.934-15.934-15.934H15.934c-8.8 0-15.934 7.133-15.934 15.934V416.4c0 41.878 34.07 75.95 75.95 75.95V460.48c-24.31 0-44.083-19.78-44.083-44.083v-22.84H270.87v22.838c0 41.88 34.072 75.95 75.95 75.95 41.88 0 75.95-34.07 75.95-75.95V167.303h73.296c8.8 0 15.934-7.133 15.934-15.934V80.2c0-33.387-27.16-60.548-60.548-60.548zm28.68 115.784h-57.36V80.2c0-15.818 12.87-28.68 28.68-28.68s28.68 12.863 28.68 28.68v55.236z"/>
            <path fill="#fff" d="M72.763 460.48h270.335v31.868H72.763zM236.88 108.35h-82.324c-8.8 0-15.934 7.132-15.934 15.933s7.133 15.934 15.934 15.934h82.324c8.8 0 15.934-7.133 15.934-15.934s-7.134-15.934-15.934-15.934zM332.48 172.083H154.557c-8.8 0-15.934 7.133-15.934 15.934s7.133 15.934 15.934 15.934H332.48c8.802 0 15.935-7.132 15.935-15.933s-7.133-15.934-15.934-15.934zM332.48 235.817H154.557c-8.8 0-15.934 7.133-15.934 15.934 0 8.802 7.133 15.935 15.934 15.935H332.48c8.802 0 15.935-7.128 15.935-15.934 0-8.8-7.133-15.933-15.934-15.933zM332.48 299.552H154.557c-8.8 0-15.934 7.133-15.934 15.934s7.133 15.934 15.934 15.934H332.48c8.802 0 15.935-7.133 15.935-15.934s-7.133-15.934-15.934-15.934z"/>
          </svg>
        </div>
        {{ruleTitles[rule.type]}}
      </div>
      <template v-if="rule.type === 'list'">
        <keywords
          v-for="element in rule.elements"
          v-model="element.condotopm"
          :key="element.id"
          >
          <slot></slot>
        </keywords>
      </template>
    </div>
  </div>
</template>

<script>
import keywords from "../keywords.vue";

export default {
  // data() {
  //   return {
  //     elementTitles: {
  //       list: ''
  //     }
  //   }
  // },

  props: ['elements'],

  components: {
    keywords
  },

  computed: {
    rules() {
      const { elements } = this;
      const rules = []
      const listRules = []

      elements.forEach((element, index) => {
        const rule = { element };

        if (element.type !== 'rule') return;

        const { value, entity, operand } = element.condition;

        switch(value) {
          case 'postReply':
            rule.post = elements[elements.indexOf(element) + 1]
          case 'adReply':
          case 'storyReply':
            rule.id = element.id;
            rule.type = value;
            rules.push(rule)
          break;
          default:
            if (entity !== 'message' || operand !== 'contains') return;

            if (!listRules.length) {
              rules.push({type: 'list', elements: listRules, id: element.id })
            }

            listRules.push(element)
          break
        }
      });

      return rules
    },

    ruleTitles() {
      return {
        list: 'List',
        postReply: 'Post Reply',
        adReply: 'Ad Reply',
        storyReply: 'Story Reply',
      }
    }
  }
}
</script>

<style lang="scss">
.rule-container {

}

.rule-item {
  .rule-title {
    background-color: #C34794;
    padding: 7px 14px;
    color: #FFF;
    border: none;
    height: auto;
    line-height: normal;
    border-radius: 18px;
    display: flex;
    align-items: center;
  }

  .rule-icon {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }

  .keywords {
    margin-top: 10px;
  }
}
</style>
