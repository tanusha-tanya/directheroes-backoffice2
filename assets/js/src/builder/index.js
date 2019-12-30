import Vue from 'vue'
import ObjectId from '../../oldJS/utils/ObjectId';
import { userInputSubscriber } from '../../oldJS/elements/userInput'

export default {
  create(campaign) {
    return new Vue({
      data() {
        return {
          campaign,
          arrows: [],
          subArrows: []
        }
      },

      computed: {
        steps() {
          const { steps } = this.campaign;

          return steps;
        },

        scheme() {
          const { getAllMatchElements } = this;
          const { steps } = this.campaign;
          const sprouts = steps
            .filter(step => step.displaySettings && step.displaySettings.hasOwnProperty('rowIndex'))
            .sort((sproutA, sproutB) => sproutA.rowIndex - sproutB.rowIndex);
          const firstStep = steps[0];
          const getStepMatches = (stepColumn) => {
            const stepsTreeColumns = stepsTree.length - 1
            let linkElements = [];

            stepColumn.forEach(step => {
              if (!step) return;

              step.elements.map(stepElement => {
                const matchesHandler = (element, suffix = '') => {
                  const matches = getAllMatchElements(element);

                  matches.forEach(matchElement => {
                    const match = matchElement.onMatch || matchElement;
                    const failTarget = matchElement.onFail && matchElement.onFail.target;
                    const { target } = match;
                    const isExistingStepLink = matchElement.type === 'linker' && matchElement.displaySettings

                    if (!isExistingStepLink) {
                      linkElements.push(target);
                    }

                    if (failTarget) {
                      arrows.push({parent: `${stepElement.id}-fail`, child: failTarget, stepId: step.id});
                      linkElements.push(failTarget);
                    }

                    if (target) {
                      const arrowObject = { parent: stepElement.id + suffix, child: target, stepId: step.id }

                      if (isExistingStepLink) {
                        subArrows.push({ ...arrowObject, isExisting: true});
                      } else {
                        arrows.push(arrowObject);
                      }
                    }
                  })
                };

                if (stepElement.displaySettings && ['followers', 'scarcity', 'waitTillCondition'].includes(stepElement.displaySettings.type)) {
                  stepElement.elements.forEach(matchesHandler);
                } else {
                  matchesHandler(stepElement)
                }

                sprouts.forEach((sprout, index, sproutArray) => {
                  if (sprout.displaySettings.columnIndex === stepsTreeColumns && sprout.displaySettings.rowIndex <= linkElements.length) {
                    linkElements.push(sprout.id);
                    sproutArray.splice(index, 1);
                  }
                })
              });
            })

            sprouts.forEach((sprout, index, sproutArray) => {
              if (sprout.displaySettings.columnIndex !== stepsTreeColumns) return;

              linkElements.push(sprout.id);
              sproutArray.splice(index, 1);
            })


            if (!linkElements.length) {
              sprouts.forEach((sprout, index, sproutArray) => {
                sprout.displaySettings.columnIndex = stepsTreeColumns;
                linkElements.push(sprout.id);
                sproutArray.splice(index, 1);
              })

              if (!linkElements.length) return;
            }

            linkElements = linkElements.map(elementTarget => {
              if (!elementTarget) return elementTarget;

              return steps.find(step => step.id === elementTarget)
            });

            stepsTree.push(linkElements);

            getStepMatches(linkElements);
          };
          const stepsTree = [[firstStep]];
          const arrows = [];
          const subArrows = [];

          getStepMatches(stepsTree[0])

          this.arrows = arrows;
          this.subArrows = subArrows;

          return stepsTree;
        }
      },

      methods: {
        getStep(stepId) {
          const { steps } = this;

          return steps.find(step => step.id === stepId);
        },

        getStepByElement(element) {
          const { steps } = this;

          return steps.find(step => step.elements.includes(element));
        },

        getStepColumn(step) {
          const { scheme } = this;

          return scheme.find(schemaColumn => schemaColumn.includes(step))
        },

        getElementByTargetId(targetId) {
          const { steps, getAllMatchElements } = this;
          const matchElement = [];

          steps.some(step => {
            return step.elements.forEach(element => {
              const elementMatches = getAllMatchElements(element);

              elementMatches.forEach(elementMatched => {
                const { type } = elementMatched;

                switch (type) {
                  case 'linker':
                    if (elementMatched.target === targetId) {
                      matchElement.push(elementMatched);
                    }

                    break;
                  case 'rule':
                    if (elementMatched.onMatch && elementMatched.onMatch.target === targetId) {
                      matchElement.push(elementMatched);
                    } else if (elementMatched.onFail && elementMatched.onFail.target === targetId) {
                      matchElement.push(elementMatched);
                    }

                    break;
                }
              })
            })
          });

          return matchElement
        },

        getAllMatchElements(element) {
          const { getAllMatchElements } = this;
          const { type } = element;
          let matches = [];

          switch (type) {
            case 'group':
              if (element.displaySettings.subType === 'settings') return matches;

              element.elements.forEach(subElement => {
                matches = matches.concat(getAllMatchElements(subElement))
              })

              break;
            case 'linker':
              matches.push(element)
              break;
            case 'rule':
              const { value } = element.condition;
              let matchElement = element;

              if (['postShare', 'storyMention', 'storyShare'].includes(value)) {
                matchElement = element.onMatch.elements[0]
              }

              if (matchElement.onMatch && matchElement.onMatch.target || matchElement.onFail && matchElement.onFail.target) {
                matches.push(matchElement)
              }

              break;
          }

          return matches
        },

        getElementByType(step, type) {
          let foundElement = step.elements.find(element => element.type === type);

          if (step.displaySettings && step.displaySettings.subType === 'trigger' && ['postShare', 'storyMention', 'storyShare'].includes(foundElement.condition.value)) {
            foundElement = foundElement.onMatch.elements[0]
          }

          return foundElement;
        },

        getStepArrows(stepId) {
          const { arrows, subArrows } = this;
          const stepArrows = [];

          arrows.concat(subArrows).forEach(arrow => {
            if (arrow.stepId !== stepId && arrow.child !== stepId) return;

            stepArrows.push(arrow);
          })

          return stepArrows;
        },

        stepsInOneBranch(endStepId, searchStepId) {
          const { arrows, stepsInOneBranch } = this;
          const endStepConnection = arrows.find(arrow => arrow.child === endStepId);

          if (!endStepConnection) return;

          if (endStepConnection.stepId === searchStepId) {
            return true
          } else {
            return stepsInOneBranch(endStepConnection.stepId, searchStepId)
          }
        },

        stepInBrokenBranch(stepId) {
          const { arrows, stepInBrokenBranch, getStep } = this;
          const endStepConnection = arrows.find(arrow => arrow.child === stepId);

          if (!endStepConnection) return;

          const step = getStep(endStepConnection.stepId)

          if (step.displaySettings && step.displaySettings.hasOwnProperty('columnIndex')) {
            return true
          } else {
            return stepInBrokenBranch(endStepConnection.stepId)
          }
        },

        clearStepData(elementsList = [], childStepId) {
          const { getStepByElement } = this;

          elementsList.forEach( element => {
            const { type } = element;

            switch (type) {
              case 'linker':
                const linkerStep = getStepByElement(element)

                linkerStep.elements.splice(linkerStep.elements.indexOf(linkerStep), 1)

                break;
              case 'rule':
                if (element.onMatch && element.onMatch.target === childStepId) {
                  Vue.set(element, 'onMatch', undefined);
                } else if (element.onFail && element.onFail.target === childStepId) {
                  Vue.set(element, 'onFail', undefined);
                }

                break;
            }
          })
        },

        addStep(parentElement, stepElement, isFail) {
          const { steps, getElementByType, addStep } = this;
          const step = {
            id: (new ObjectId).toString(),
            elements: [
              {
                id: (new ObjectId).toString(),
                ...stepElement
              }
            ]
          }

          if (stepElement.type === 'group') {
            stepElement.elements.forEach(element => {
              element.id = (new ObjectId).toString()
            })
          }

          switch (stepElement.displaySettings.subType) {
            case 'message':
              step.name = 'New message'

              if (['delay', 'delayTill'].includes(stepElement.displaySettings.type)) {
                const checkpoint = getElementByType(stepElement, 'checkpoint');
                const action = getElementByType(stepElement, 'action');

                action.body.checkpointId = checkpoint.id;
              }
              break;

            case 'condition':
              step.name = 'Condition'

              if (['timeout', 'waitTillCondition'].includes(stepElement.displaySettings.type)) {
                const checkpoint = getElementByType(stepElement, 'checkpoint');
                const action = getElementByType(stepElement, 'action');

                action.body.checkpointId = checkpoint.id;
              } else if (stepElement.displaySettings.type === 'scarcity') {
                const action = getElementByType(stepElement, 'action');
                const rule = getElementByType(stepElement, 'rule');

                rule.condition.field = action.id;
              }

              break;
            case 'user-input':
              step.name = 'User Input'

              if (!parentElement || !parentElement.displaySettings || !['condition', 'trigger'].includes(parentElement.displaySettings.subType)) {
                step.elements[0].elements.splice(0,0, {
                  type: 'checkpoint',
                  id: (new ObjectId).toString()
                })
              }

              addStep(stepElement, userInputSubscriber)
              break;
            case 'sub-input':
              step.name = 'Collect'
              break;
          }

          switch (parentElement.type) {
            case 'linker':
              parentElement.target = step.id
              break;
            default:
              let rule = getElementByType(parentElement, 'rule');

              const { onMatch, onFail } = rule;

              if (isFail) {
                if (onFail) {
                  Vue.set(onFail, 'target', step.id)
                } else {
                  Vue.set(rule, 'onFail', {
                   action: 'goto',
                   target: step.id
                  });
                }
              } else {
                if (onMatch) {
                  Vue.set(onMatch, 'target', step.id)
                } else {
                  Vue.set(rule, 'onMatch', {
                   action: 'goto',
                   target: step.id
                  });
                }
              }

              break;
          }

          steps.push(step)
        },

        deleteStep(step) {
          const { getStepArrows, clearStepData, getStep, getElementByTargetId, getStepColumn, scheme, steps } = this;
          const stepArrows = getStepArrows(step.id);
          const stepColumn = getStepColumn(step);
          const stepColumnIndex = scheme.indexOf(stepColumn);
          const childStepColumnIndex = stepColumn.length > 1 ? stepColumnIndex + 1 : stepColumnIndex;

          stepArrows.forEach((stepArrow, index) => {
            const isParentArrow = stepArrow.child === step.id;
            const childStep = getStep(stepArrow.child);

            clearStepData(getElementByTargetId(stepArrow.child), stepArrow.child);

            if (isParentArrow) return;

            childStep.displaySettings = Object.assign(childStep.displaySettings || {}, {
              columnIndex: childStepColumnIndex,
              rowIndex: stepColumn.indexOf(step) + index
            });
          })

          steps.splice(steps.indexOf(step), 1)
        },

        deleteLink({ arrowInfo }) {
          const { clearStepData, getStep, getElementByTargetId, getStepColumn, scheme } = this;
          const childStep = getStep(arrowInfo.child);
          const childStepColumn = getStepColumn(childStep)
          const childStepColumnIndex = scheme.indexOf(childStepColumn);

          childStep.displaySettings = Object.assign(childStep.displaySettings || {}, {
            columnIndex: childStepColumnIndex - 1,
            rowIndex: childStepColumn.indexOf(childStep)
          });

          clearStepData(getElementByTargetId(arrowInfo.child), arrowInfo.child)
        }
      }
    })
  }
}