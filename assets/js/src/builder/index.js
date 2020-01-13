import Vue from 'vue'
import ObjectId from '../../oldJS/utils/ObjectId';
import elementsPermissions from '../../oldJS/elements/permissions'
// import { userInputSubscriber } from '../../oldJS/elements/userInput'

export default {
  create(campaign, account) {
    return new Vue({
      data() {
        return {
          campaign,
          account,
          arrows: [],
          subArrows: [],
          parentOfExistStep: null,
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
                    const isExistingStepLink = match.displaySettings || ( matchElement.onFail && matchElement.onFail.displaySettings)

                    if (!isExistingStepLink) {
                      linkElements.push(target);
                    }

                    if (failTarget) {
                      if (isExistingStepLink) {
                        subArrows.push({parent: `${stepElement.id}-fail`, child: failTarget, stepId: step.id, isExisting: true});
                      } else {
                        arrows.push({parent: `${stepElement.id}-fail`, child: failTarget, stepId: step.id});
                      }


                      if (!isExistingStepLink) {
                        linkElements.push(failTarget);
                      }
                    }

                    if (target) {
                      const arrowObject = { parent: stepElement.id + suffix, child: target, stepId: step.id }

                      console.log(match, isExistingStepLink);

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
        },

        isBroadcast() {
          const { campaign } = this;

          return campaign.type === 'broadcast';
        },
      },

      methods: {
        availableListByElement(element = { displaySettings: {} }, isFail, isEntry) {
          const { isBroadcast, account } = this;
          const { elements, growthTools, triggers } = account.flowBuilderSettings;
          const { type, subType } = element.displaySettings;

          switch ( subType ) {
            case 'trigger':
              const { fromTrigger } = elementsPermissions;

              return [].concat(fromTrigger, elements);
            break;
            case 'message':
              const { fromMessageStep } = elementsPermissions;

              if (isBroadcast) {
                return element.body.action === 'sendMedia' ? ['sendText'] : ['sendMedia', 'sendText']
              } else {
                return [].concat(triggers.messageTypes, fromMessageStep, elements);
              }
            break;
            case 'action':
              const { fromActionStep } = elementsPermissions;

              return [].concat(triggers.messageTypes, fromActionStep, elements);
            break;
            case 'condition':
              const { fromCondition } = elementsPermissions;

              return [].concat(triggers.messageTypes, fromCondition, elements);
            break;
            default:
              if (isBroadcast) {

              } else {
                return isEntry ? growthTools.messageTypes : triggers.messageTypes
              }
          }
        },

        connectStepToStepById(step, stepId) {
          const { getElementByType } = this;
          const firstElement = step.elements[0];

          if (firstElement.type === 'action') {
            step.elements.push({
              id: (new ObjectId).toString(),
              type: 'linker',
              target: stepId
            })
          } else {
            const matchElement = getElementByType(firstElement, 'rule');

            if (firstElement.displaySettings.type === 'waitTillCondition') {
              Vue.set(matchElement, 'onFail', {
                action: 'goto',
                target: stepId
              });
            } else {
              Vue.set(matchElement, 'onMatch', {
                action: 'goto',
                target: stepId
              });
            }
          }
        },

        connectExistingStep(stepToConnect) {
          const { getMatchElementsByTargetId, getElementByType, parentOfExistStep } = this;
          const { step, parentElement, isFail } = parentOfExistStep;
          const isConnectedStep = Boolean(getMatchElementsByTargetId(stepToConnect.id).length)
          const displaySettings = {
            subType: 'existingStep'
          }

          if (parentElement.type === 'linker') {
            Vue.set(parentElement, 'target', stepToConnect.id)

            if (isConnectedStep) {
              Vue.set(parentElement, 'displaySettings', displaySettings)
            } else {
              Vue.set(stepToConnect, 'displaySettings', null)
            }
          } else {
            let rule = getElementByType(parentElement, 'rule');

            const { onMatch, onFail } = rule;

            if (isFail) {
              if (onFail) {
                Vue.set(onFail, 'target', stepToConnect.id)
              } else {
                Vue.set(rule, 'onFail', {
                 action: 'goto',
                 target: stepToConnect.id
                });
              }

              if (isConnectedStep) {
                Vue.set(rule.onFail, 'displaySettings', displaySettings)
              } else {
                Vue.set(stepToConnect, 'displaySettings', null)
              }
            } else {
              if (onMatch) {
                Vue.set(onMatch, 'target', stepToConnect.id)
              } else {
                Vue.set(rule, 'onMatch', {
                 action: 'goto',
                 target: stepToConnect.id
                });
              }

              if (isConnectedStep) {
                Vue.set(rule.onMatch, 'displaySettings', displaySettings)
              } else {
                Vue.set(stepToConnect, 'displaySettings', null)
              }
            }
          }
        },

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

        getMatchElementsByTargetId(targetId) {
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

        getElementById(elementId) {
          const { steps } = this;
          let foundElement = null;

          steps.some(step => {
            return  step.elements.some( element => {
              if (element.id !== elementId) return;

              foundElement = element;
              return true;
            })
          })

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
          const { steps, getElementByType, addStep, connectStepToStepById } = this;
          const step = {
            id: (new ObjectId).toString(),
            elements: [
              {
                id: (new ObjectId).toString(),
                ...stepElement
              }
            ]
          }

          if (stepElement.type === 'existingStep') {
            this.parentOfExistStep = {
              step: this.getStepByElement(parentElement),
              parentElement,
              isFail
            }

            return
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

              // addStep(stepElement, userInputSubscriber)
              break;
            case 'sub-input':
              step.name = 'Collect'
              break;
          }

          switch (parentElement.type) {
            case 'linker':
              if (parentElement.target) {
                connectStepToStepById(step, parentElement.target)
              }

              parentElement.target = step.id
              break;
            default:
              let rule = getElementByType(parentElement, 'rule');

              const { onMatch, onFail } = rule;

              if (isFail) {
                if (onFail) {
                  if (onFail.target) {
                    connectStepToStepById(step, onFail.target)
                  }

                  Vue.set(onFail, 'target', step.id)
                } else {
                  Vue.set(rule, 'onFail', {
                   action: 'goto',
                   target: step.id
                  });
                }
              } else {
                if (onMatch) {
                  if (onMatch.target) {
                    connectStepToStepById(step, onMatch.target)
                  }

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
          const { getStepArrows, clearStepData, getStep, getMatchElementsByTargetId, getStepColumn, scheme, steps } = this;
          const stepArrows = getStepArrows(step.id);
          const stepColumn = getStepColumn(step);
          const stepColumnIndex = scheme.indexOf(stepColumn);
          const childStepColumnIndex = stepColumn.length > 1 ? stepColumnIndex + 1 : stepColumnIndex;

          stepArrows.forEach((stepArrow, index) => {
            const isParentArrow = stepArrow.child === step.id;
            const childStep = getStep(stepArrow.child);

            console.log(stepArrow);

            clearStepData(getMatchElementsByTargetId(stepArrow.child), stepArrow.child);

            if (isParentArrow) return;

            childStep.displaySettings = Object.assign(childStep.displaySettings || {}, {
              columnIndex: childStepColumnIndex,
              rowIndex: stepColumn.indexOf(step) + index
            });
          })

          steps.splice(steps.indexOf(step), 1)
        },

        deleteLink({ arrowInfo }) {
          const { clearStepData, getStep, getMatchElementsByTargetId, getStepColumn, scheme } = this;
          const childStep = getStep(arrowInfo.child);
          const childStepColumn = getStepColumn(childStep)
          const childStepColumnIndex = scheme.indexOf(childStepColumn);

          childStep.displaySettings = Object.assign(childStep.displaySettings || {}, {
            columnIndex: childStepColumnIndex - 1,
            rowIndex: childStepColumn.indexOf(childStep)
          });

          clearStepData(getMatchElementsByTargetId(arrowInfo.child), arrowInfo.child)
        }
      },

      watch: {
        parentOfExistStep(newValue, oldValue) {
          const isOldLinker = oldValue && oldValue.parentElement.type === 'linker'

          if (newValue || !isOldLinker || (isOldLinker && oldValue.parentElement.target)) return;

          const { parentElement, step} = oldValue;

          step.elements.splice(step.elements.indexOf(parentElement), 1);
        }
      }
    })
  }
}