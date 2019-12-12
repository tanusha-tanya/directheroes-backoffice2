const getAllMatchElements = (element) => {
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
      const matchElement = element;

      if (['postShare', 'storyMention', 'storyShare'].includes(value)) {
        matchElement = element.onMatch.elements[0]
      }

      if (matchElement.onMatch && matchElement.onMatch.target || matchElement.onFail && matchElement.onFail.target) {
        matches.push(matchElement)
      }

      break;
  }

  return matches
}

class Builder {
  constructor(campaign) {
    this.campaign = campaign;
    this.arrows = [];
  }

  get steps() {
    const { steps } = this.campaign;

    return steps;
  }

  get scheme() {
    const { steps } = this.campaign;
    const firstStep = steps[0];
    const getStepMatches = (stepRow) => {
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
                arrows.push({parent: `${matchElement.id}-fail`, child: failTarget, stepId: step.id});
              }

              if (target) {
                const arrowObject = { parent: matchElement.id + suffix, child: target, stepId: step.id }

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
        });
      })

      if (!linkElements.length) return;

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

}

Builder.prototype.getAllMatchElements = getAllMatchElements;

export default Builder