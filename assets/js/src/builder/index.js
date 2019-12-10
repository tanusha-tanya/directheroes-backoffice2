export default class Builder {
  constructor(campaign) {
    this.campaign = campaign
  }

  get steps() {
    const { steps } = this.campaign;

    return steps;
  }

  get scheme() {
    const { steps } = this;
    const firstStep = steps[0];
    const scheme = {};

    if (!firstStep.displaySettings.hasOwnProperty('rowIndex')) {
      this.updateOldStructure();
    }

    // steps.forEach(step => {
    //   const { id, displaySettings } = step;


    // });
  }

  updateOldStructure() {
    const { getAllMatchElements } = this;
    const { steps } = this.campaign;
    const firstStep = steps[0];
    const getStepMatches = (stepLinks, treeIndex) => {
      Object.keys(stepLinks).forEach(stepId => {
        const step = steps.find(step => step.id === stepId);
        const stepTree = stepLinks[stepId];

        if (!step) return;

        step.elements.forEach(element => {
          const matches = getAllMatchElements(element)
        });
      })
    };
    const stepsTree = {
      [firstStep.id]: {}
    };

    getStepMatches(stepsTree, 0)
  }

  getAllMatchElements(element) {
    const { getAllMatchElements } = this;
    const { type } = element;
    let matches = [];

    switch (type) {
      case 'group':
        element.elements.forEach(subElement => {
          matches = matches.concat(getAllMatchElements(subElement))
        })
        break;
      case 'linker':

        break;
      case 'rule':
        console.log(element)
        break;
      default:
        break;
    }

    return matches
  };
}