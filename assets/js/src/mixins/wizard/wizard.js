export default {
  data() {
    return {
      title: '',
      width: 900,
      wizardState: null,
      parentWizard: true
    }
  },

  props: ['value'],

  computed: {
    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    },
  },

  methods: {
    setWizardState(title, wizardState) {
      this.title = title;
      this.wizardState = wizardState;
    },

    closeWizard() {
      this.isShow = false;
    }
  }
}