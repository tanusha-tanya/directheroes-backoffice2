<template>
  <div class="rule-container">
    <div class="rule-item" v-for="rule in rules" :key="rule.id">

    </div>
  </div>
</template>

<script>
export default {
   props: ['elements'],

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

      return  rules
    }
  }
}
</script>

<style>

</style>
