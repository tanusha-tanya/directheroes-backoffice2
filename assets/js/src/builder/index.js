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
    const { steps } = this.campaign;
    const firstStep = steps[0];
    const getAllMatches = (element) => {
      const { type } = element;
      const matches = [];

      switch (type) {
        case 'group':

          break;
        case 'linker':

          break;
        case 'rule':

          break;

        default:
          break;
      }

      return matches
    };
    const getStepMatches = (stepLinks, treeIndex) => {
      Object.keys(stepLinks).forEach(stepId => {
        const step = steps.find(step => step.id === stepId);
        const stepTree = stepLinks[stepId];

        if (!step) return;

        step.elements.forEach(element => {
          const matches = getAllMatches(element)
        });
      })
    };
    const stepsTree = {
      [firstStep.id]: {}
    };

    getStepMatches(stepsTree, 0)
  }
}