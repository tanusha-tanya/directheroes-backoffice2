import Vue from 'vue'
import ObjectId from '../../oldJS/utils/ObjectId';
import elementsPermissions from '../../oldJS/elements/permissions'
import actions from "../../oldJS/elements/actions";
import store from '../store';

const addTagElement = actions.find(action => action.template.body.action === 'addCategory')

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
          const { getAllMatchElements, getStep } = this;
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
                    const isMatchExistingStepLink = match.displaySettings
                    const isFailExistingStepLink = matchElement.onFail && matchElement.onFail.displaySettings

                    if (!isMatchExistingStepLink) {
                      linkElements.push(target);
                    }

                    if (failTarget) {
                      if (isFailExistingStepLink) {
                        subArrows.push({
                          parent: `${stepElement.id}-fail`,
                          child: failTarget,
                          stepId: step.id,
                          linkElement: matchElement.onFail,
                          step,
                          isExisting: true
                        });
                      } else {
                        arrows.push({
                          parent: `${stepElement.id}-fail`,
                          child: failTarget,
                          linkElement: matchElement.onFail,
                          step,
                          stepId: step.id
                        });
                      }

                      if (!isFailExistingStepLink) {
                        linkElements.push(failTarget);
                      }
                    }

                    if (target) {
                      const arrowObject = {
                        parent: stepElement.id + suffix,
                        child: target,
                        stepId: step.id,
                        step,
                        linkElement: match
                      }

                      if (isMatchExistingStepLink) {
                        subArrows.push({ ...arrowObject, isExisting: true});
                      } else {
                        arrows.push(arrowObject);
                      }
                    }

                    const childStep = getStep(failTarget || target);

                    if (childStep && childStep.displaySettings) {
                      Vue.set(childStep, 'displaySettings', null)
                    }
                  })
                };

                if (stepElement.displaySettings && ['followers', 'subscriberField', 'scarcity', 'waitTillCondition'].includes(stepElement.displaySettings.type)) {
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

              if (!linkElements.length) {
                const hiddenStep = steps.find(step => !stepsTree.some(stepsColumn => {
                  // stepsColumn.some(stepColumn => console.log(stepColumn && stepColumn.id, step && step.id, stepColumn, step))

                  return stepsColumn.includes(step)
                }));

                if(!hiddenStep || (hiddenStep.displaySettings && hiddenStep.displaySettings.columnIndex)) return;

                hiddenStep.displaySettings = {
                  columnIndex: stepsTreeColumns - 1,
                  rowIndex: 0
                }

                linkElements.push(hiddenStep.id)

                if (!linkElements.length) return;
              }
            }

            linkElements = linkElements.map(elementTarget => {
              if (!elementTarget) return elementTarget;

              return getStep(elementTarget) || null
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

        allCategories() {
          const { currentAccountData, currentAccount } = store.state;
          let categories = [];

          currentAccountData.campaigns.forEach(campaign => {
            campaign.steps.forEach(step => {
              step.elements.some(element => {
                if (!element.displaySettings || !['action', 'sub-input'].includes(element.displaySettings.subType)) return true;

                if (!element.body || element.body.action !== 'addCategory') return;

                if (!element.body.name) return;

                element.body.name.forEach(nameItem => {
                  if (categories.includes(nameItem)) return;

                  categories.push(nameItem);
                });
              })
            })
          })

          currentAccount.subscriberCategoryList.forEach(category => {
            if (categories.includes(category.name)) return;

            categories.push(category.name);
          })

          return categories;
        }
      },

      methods: {
        availableListByElement(element = { displaySettings: {} }, isFail, isEntry) {
          const { isBroadcast, account } = this;
          const { elements, growthTools, triggers } = account.flowBuilderSettings;
          const { subType } = element.displaySettings;

          switch ( subType ) {
            case 'trigger':
              const { fromTrigger } = elementsPermissions;

              return [].concat(fromTrigger, elements);
            break;
            case 'message':
              const { fromMessageStep, fromLinkedMessageStep } = elementsPermissions;

              if (isBroadcast) {
                return element.body.action === 'sendMedia' ? ['sendText'] : ['sendMedia', 'sendText']
              } else {
                if (isFail) {
                  return [].concat(fromLinkedMessageStep);
                } else {
                  return [].concat(triggers.messageTypes, fromMessageStep, elements);
                }
              }
            break;
            case 'action':
              const { fromActionStep } = elementsPermissions;

              return [].concat(triggers.messageTypes, fromActionStep, elements);
            break;
            case 'condition':
              const { fromCondition } = elementsPermissions;

              return [].concat(fromCondition, elements);
            break;
            default:
              if (isBroadcast) {

              } else {
                return isEntry ? growthTools.messageTypes : triggers.messageTypes
              }
          }
        },

        connectStepToStepById(step, stepId) {
          const { getElementByType, getStep } = this;
          let firstElement = step.elements.find(element => element.type !== 'checkpoint');

          if (firstElement.displaySettings && firstElement.displaySettings.subType == 'user-input') {
            const linker = getElementByType(firstElement, 'linker');

            const actionStep = getStep(linker.target);

            step = actionStep;
            firstElement = actionStep.elements[0]
          }

          if (firstElement.type === 'action' || (firstElement.displaySettings && ['message', 'action'].includes(firstElement.displaySettings.subType))) {
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

          steps.forEach(step => {
            step.elements.forEach(element => {
              const elementMatches = getAllMatchElements(element);

              elementMatches.forEach(elementMatched => {
                const { type } = elementMatched;

                switch (type) {
                  case 'linker':
                    if (elementMatched.target === targetId) {
                      matchElement.push(elementMatched);
                    }

                    break;
                  // case 'rule':
                  default:
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
          const { getAllMatchElements, getElementByType } = this;
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

        getParentSteps(searchStepId) {
          const { arrows, subArrows } = this;

          return  arrows
            .concat(subArrows)
            .filter(arrow => arrow.child === searchStepId)
            .map(arrow => arrow.step);
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

        clearStepData(elementsList = [], childStepId, isFail) {
          const { getStepByElement, getAllMatchElements, getElementByType } = this;

          elementsList.forEach( element => {
            const { type } = element;

            switch (type) {
              case 'linker':
                const { steps } = this;
                let linkerStep = getStepByElement(element);

                if(!linkerStep) {
                  steps.some(step => step.elements.some(stepElement => {
                    const matchElements = getAllMatchElements(stepElement);

                    if (!matchElements.includes(element)) return;

                    linkerStep = stepElement
                  }))
                }

                linkerStep.elements.splice(linkerStep.elements.indexOf(linkerStep), 1)

                break;
              default: //case 'rule':
                if (!isFail && element.onMatch && element.onMatch.target === childStepId) {
                  Vue.set(element, 'onMatch', undefined);
                } else if (isFail && element.onFail && element.onFail.target === childStepId) {
                  Vue.set(element, 'onFail', undefined);
                }

                break;
            }
          })
        },

        checkChildStep(parentStep, childStep) {
          if (!parentStep || !childStep) return;

          const parenFirstElement = parentStep.elements.find(element => element.type !== 'checkpoint')
          const childFirstElement = childStep.elements.find(element => element.type !== 'checkpoint')
          const parentIsCondition = parenFirstElement.displaySettings && parenFirstElement.displaySettings.subType === 'condition';
          const childIsTrigger = childFirstElement.displaySettings && childFirstElement.displaySettings.subType === 'trigger';
          const childIsUserInput = childFirstElement.displaySettings && childFirstElement.displaySettings.subType === 'user-input';

          if (parentIsCondition && (childIsTrigger || childIsUserInput)) {
            const searchContainer = childIsUserInput ? childStep.elements[0] : childStep
            const hasCheckpoint = searchContainer.elements.find(element => element.type === 'checkpoint');

            if (!hasCheckpoint) {
              childStep.elements.splice(0,0, {
                type: 'checkpoint',
                id: (new ObjectId).toString()
              })
            }
            // else {
            //   childStep.elements.splice(childStep.elements.indexOf(childStep.elements))
            // }
          }
        },

        addStep(parentElement, stepElement, isFail) {
          stepElement = JSON.parse(JSON.stringify(stepElement));

          const { steps, checkChildStep, getStep, getElementByType, getStepByElement, addStep, connectStepToStepById, availableListByElement } = this;
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
            let step = this.getStepByElement(parentElement);

            if (parentElement.displaySettings && ['followers', 'subscriberField', 'scarcity'].includes(parentElement.displaySettings.type)) {
              const ruleElement = parentElement.elements[0];

              steps.some(searchStep => searchStep.elements.some(element => {
                if (!element.displaySettings || !['followers', 'subscriberField', 'scarcity'].includes(element.displaySettings.type)) return;

                return element.elements.some(subElement => {
                  if (subElement.id !== ruleElement.id) return;

                  step = searchStep;

                  return true;
                })
              }))
            } else if (parentElement.displaySettings && parentElement.displaySettings.type === 'waitTillCondition') {
              const ruleElement = parentElement.elements[0];

              steps.some(searchStep => searchStep.elements.some(element => {
                if (!element.displaySettings || element.displaySettings.type !== 'waitTillCondition' || !element.elements.includes(ruleElement)) return;

                  step = searchStep;
                  return true;
              }))
            }

            const firstElement = step.elements.find(element => element.type !== 'checkpoint' && (element.displaySettings && element.displaySettings.subType !== 'settings'))

            this.parentOfExistStep = {
              step,
              parentElement,
              availableList: availableListByElement(firstElement, isFail),
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
              if (['waitTillCondition'].includes(stepElement.displaySettings.type)) {
                const checkpoint = getElementByType(stepElement, 'checkpoint');
                const action = getElementByType(stepElement, 'action');

                action.body.checkpointId = checkpoint.id;
              } else if (stepElement.displaySettings.type === 'scarcity') {
                const action = getElementByType(stepElement, 'action');
                const rule = getElementByType(stepElement, 'rule');

                rule.condition.field = action.id;
              }

              break;
            // case 'user-input':
            //   const addTagTemplate = JSON.parse(JSON.stringify(addTagElement.template));
            //   const newLinker = {
            //     id: (new ObjectId).toString(),
            //     type: 'linker'
            //   };

            //   step.name = 'User Input'

            //   step.elements[0].elements.push(newLinker);

            //   if (!parentElement || !parentElement.displaySettings || !['condition', 'trigger'].includes(parentElement.displaySettings.subType)) {
            //     step.elements[0].elements.splice(0,0, {
            //       type: 'checkpoint',
            //       id: (new ObjectId).toString()
            //     })
            //   }

            //   addTagTemplate.body.name.push('Email collected');

            //   addStep(newLinker, addTagTemplate)
            //   break;
            case 'action':
              step.name = 'Action'
              break;
            case 'trigger':
              step.name = 'Trigger'

              if (!parentElement || !parentElement.displaySettings) {
                step.elements.splice(0,0, {
                  type: 'checkpoint',
                  id: (new ObjectId).toString()
                })
              }

              if (stepElement.displaySettings.type === 'user-input') {
                const addTagTemplate = JSON.parse(JSON.stringify(addTagElement.template));

                addTagTemplate.body.name.push('Email collected');
                addStep(stepElement, addTagTemplate)
              }

              break;
          }

          switch (parentElement.type) {
            case 'linker':
              if (parentElement.target) {
                connectStepToStepById(step, parentElement.target)
              }

              Vue.set(parentElement, 'target', step.id)
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
                    checkChildStep(getStepByElement(parentElement), getStep(onMatch.target))
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
          const { getStepArrows, deleteLink, steps } = this;
          const stepArrows = getStepArrows(step.id);

          stepArrows.forEach((stepArrow) => {
            deleteLink({ arrowInfo: stepArrow})
          })

          steps.splice(steps.indexOf(step), 1)
        },

        deleteLink({ arrowInfo }) {
          const { clearStepData, getStep, getMatchElementsByTargetId, getStepColumn, scheme, checkChildStep } = this;
          const childStep = getStep(arrowInfo.child);
          const childStepColumn = getStepColumn(childStep)
          const childStepColumnIndex = scheme.indexOf(childStepColumn);
          const matchElements = getMatchElementsByTargetId(arrowInfo.child);
          const connectionsCount = matchElements.reduce((count, element) => {
            switch(element.type) {
              case 'linker':
                count++
              default:
                // case 'rule':
                if (element.onMatch && element.onMatch.target === arrowInfo.child ) {
                  count++
                }

                if (element.onFail && element.onFail.target === arrowInfo.child ) {
                  count++
                }
            }

            return count
          }, 0);
          const filteredElement = matchElements.find(element => {
            switch(element.type) {
              case 'linker':
                return element === arrowInfo.linkElement
              default:
                // case 'rule':
                return element.onMatch === arrowInfo.linkElement || element.onFail === arrowInfo.linkElement
            }
          })

          clearStepData([filteredElement], arrowInfo.child, filteredElement.onFail === arrowInfo.linkElement)

          if (!arrowInfo.linkElement.displaySettings && connectionsCount === 1) {
            childStep.displaySettings = Object.assign(childStep.displaySettings || {}, {
              columnIndex: childStepColumnIndex - 1,
              rowIndex: childStepColumn.indexOf(childStep)
            });

            checkChildStep(arrowInfo.step, childStep)
          } else if (!arrowInfo.linkElement.displaySettings && connectionsCount > 1) {
            matchElements.some(element => {
              let matchElement;

              if (element.type === 'linker') {
                if (element === filteredElement) return;

                matchElement = element
              } else if (element.onMatch && element.onMatch.target === arrowInfo.child) {
                matchElement = element.onMatch
              } else if (element.onFail && element.onFail.target === arrowInfo.child) {
                matchElement = element.onFail
              }

              if (!matchElement) return;

              Vue.set(matchElement, 'displaySettings', null);

              return true;
            });
          }
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