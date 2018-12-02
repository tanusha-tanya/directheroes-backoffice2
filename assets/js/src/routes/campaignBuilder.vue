<template>
  <div class="campaign-builder">
    <campaign-card :campaign="campaign" :ref="campaignStep.id"></campaign-card>
    <step-card :step="step" v-for="step in steps" :key="step.id" ref="steps"></step-card>
    <builder-elements></builder-elements>
    <arrows ref="arrows" :refs="$refs" :arrows="arrows"></arrows>
  </div>    
</template>
<script>
import campaignCard from '../component/builder-cards/campaignCard.vue'
import stepCard from '../component/builder-cards/stepCard.vue'
import arrows from '../component/arrows.vue'
import builderElements from '../component/builderElements.vue'

export default {
  data() {
    return {
      campaign: {
        name: 'Campaign Name',
        id: 'd35f8608-2d8a-47a7-96c7-cdec7f2886fe',
        steps: [
          {
            type: 'campaignEntry',
            id: '2ee5588a-f51e-4f7b-bee9-155385963b07',
            elements: [
              {
                type: 'messageCondition',
                value: {
                  messageType: 'storyShare',
                  keywords: ['Hero', 'Yes'],
                  link: ''
                }
              },
              {
                type: 'goToStep',
                stepId: '374269bc-3f44-49e0-aa14-30ca80d98c4b'
              }
            ],
            displaySettings: {
              collapsed: false,
              position: {
                  x: 50,
                  y: 200
              },
            }
          },
          {
            type: 'regular',
            name: 'Step One',
            id: '374269bc-3f44-49e0-aa14-30ca80d98c4b',
            elements: [],
            displaySettings: {
              collapsed: false,
              position: {
                  x: 200,
                  y: 600
              },
            }
              // elements: [
              //     {
              //         class: condition,
              //         type: basicDelay,
              //         value: 300,
              //         displaySettings: {
              //             visible: false
              //         }
              //     },
              //     {
              //         class: action,
              //         type: sendTextAction,
              //         message: {
              //             messageText: “{{Hi|Hello|Hey}}, {{username}}, nice to meet you!”,
              //             previewText: “Hi, sixteencharsusr, nice to meet you!”,
              //             minLength: 24,
              //             maxLength: 42
              //         },
              //         displaySettings: {
              //             isClollapsed: true
              //         }
              //     },
              //     {
              //         class: condition,
              //         type: basicDelay,
              //         delay: 300
              //     },
              //     {
              //           class: action,
              //           type: sendImageAction,

              //       value: {
              //           id: 123,
              //           name: “directheroes logo.png”,
              //           url: “/media/123.png",
              //       },

              //     },
              //     {
              //         class: condition,
              //         type: timeCondition,
              //         value: {

              //           or: {
              //               weekDay: “Monday”,
              //               weekDay: “Friday”
              //           }

              //         }
              //     },
                  
              // ],
              // displaySettings: {
              //       collapsed: false,

              //   position: {
              //       x: 500,
              //       y: 200
              //   },

              // }

          }
        ]
      }
    }
  },

  components: {
    builderElements,
    campaignCard,
    stepCard,
    arrows
  },  

  computed:{
    steps() {
      return this.campaign.steps.filter(step => step.type == 'regular')
    },

    campaignStep() {
      return this.campaign.steps.find(step => step.type = 'campaignEntry')
    },

    arrows() {
      const { campaign } = this
      const arrows = [];

      campaign.steps.forEach(step => step.elements.find(element => {
        if (element.type != 'goToStep') return;

        arrows.push({ parent: step.id, child: element.stepId});

        return true;
      }))

      return arrows;
    }
  },

  mounted() {
    console.log(this.$refs);
    
  },

  watch:{
    campaign: {
      handler: function (campaign, oldCampaign) {
        const { recalcPathes } = this.$refs.arrows;

        this.$nextTick(recalcPathes)
      },
      deep: true
    },
  }
}
</script>
<style lang="scss">
.campaign-builder {
  position: absolute;
  overflow: auto;
  height: 100%;
  width:100%;
}
</style>
