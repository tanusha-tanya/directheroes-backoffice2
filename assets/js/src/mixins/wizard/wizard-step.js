export default {
  computed: {
    wizard() {
      const getWizardParent = (parenContainer) => {
        const { $parent } = parenContainer;

        if (!$parent) return null;

        if ($parent.parentWizard) {
          return $parent;
        } else {
          return getWizardParent($parent)
        }
      }

      return getWizardParent(this);
    }
  }
}