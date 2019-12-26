import Vue from 'vue'

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
            .sort((sproutA, sproutB) => sproutA.columnIndex - sproutB.columnIndex);
          const firstStep = steps[0];
          const getStepMatches = (stepRow) => {
            const stepsTreeRows = stepsTree.length - 1
            let linkElements = [];

            stepRow.forEach(step => {
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

                if (stepElement.displaySettings && stepElement.displaySettings.type === 'followers') {
                  stepElement.elements.forEach(matchesHandler);
                } else {
                  matchesHandler(stepElement)
                }

                sprouts.forEach((sprout, index, sproutArray) => {
                  if (sprout.displaySettings.rowIndex === stepsTreeRows && sprout.displaySettings.columnIndex <= linkElements.length) {
                    linkElements.push(sprout.id);
                    sproutArray.splice(index, 1);
                  }
                })
              });
            })

            sprouts.forEach((sprout, index, sproutArray) => {
              if (sprout.displaySettings.rowIndex !== stepsTreeRows) return;

              linkElements.push(sprout.id);
              sproutArray.splice(index, 1);
            })


            if (!linkElements.length) {
              sprouts.forEach((sprout, index, sproutArray) => {
                sprout.displaySettings.rowIndex = stepsTreeRows;
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

        getStepRow(step) {
          const { scheme } = this;

          return scheme.find(schemaRow => schemaRow.includes(step))
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

          if (step.displaySettings && step.displaySettings.hasOwnProperty('rowIndex')) {
            return true
          } else {
            return stepInBrokenBranch(endStepConnection.stepId)
          }
        },

        deleteStep(step) {
          const { getStepArrows, getStep, getElementByTargetId, getStepByElement, getStepRow, scheme, steps } = this;
          const clearStepData = (elementsList = [], childStepId) => {
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
          }
          const stepArrows = getStepArrows(step.id);
          const stepRow = getStepRow(step);
          const stepRowIndex = scheme.indexOf(stepRow);
          const childStepRowIndex = stepRow.length > 1 ? stepRowIndex + 1 : stepRowIndex;

          stepArrows.forEach((stepArrow, index) => {
            const isParentArrow = stepArrow.child === step.id;

            clearStepData(getElementByTargetId(stepArrow.child), stepArrow.child)

            if (isParentArrow) return;

            const childStep = getStep(stepArrow.child);

            childStep.displaySettings = Object.assign(childStep.displaySettings || {}, {
              rowIndex: childStepRowIndex,
              columnIndex: stepRow.indexOf(step) + index
            });
          })

          steps.splice(steps.indexOf(step), 1)
        }
      }
    })
  }
}