<template>
  <div class="campaign-builder">
    <campaign-card :campaign="campaign" :ref="campaignStep.uuid"></campaign-card>
    <step-card :step="step" v-for="step in steps" :key="step.uuid" :ref="step.uuid"></step-card>
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
        uuid: 'd35f8608-2d8a-47a7-96c7-cdec7f2886fe',
        steps: [
          {
            type: 'campaignEntry',
            uuid: '2ee5588a-f51e-4f7b-bee9-155385963b07',
            elements: [
              {
                class: 'condition',
                type: 'messageCondition',
                messageType: 'story',
                value: {
                  keywords: ['Hero', 'Yes'],
                  link: ''
                }
              },
              {
                class: 'action',
                type: 'goToStepAction',
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
            uuid: '374269bc-3f44-49e0-aa14-30ca80d98c4b',
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
        if (element.type != 'goToStepAction') return;

        arrows.push({ parent: step.uuid, child: element.stepId});

        return true;
      }))
      
      return arrows;
    }
  },

  watch:{
    campaign: {
      handler: function (campaign, oldCampaign) {
        this.$refs.arrows.recalcPathes();
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
